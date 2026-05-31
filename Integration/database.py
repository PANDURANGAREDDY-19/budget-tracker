import csv
import sqlite3
from pathlib import Path
from typing import Any, Dict, List, Optional
import time

ROOT_DIR = Path(__file__).resolve().parent.parent
DB_PATH = Path(__file__).resolve().parent / 'budget_tracker.db'
RAW_DATA_DIR = ROOT_DIR / 'Database' / 'raw_data'


class DatabaseManager:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self.connection = sqlite3.connect(str(self.db_path), check_same_thread=False)
        self.connection.row_factory = sqlite3.Row
        self.connection.execute('PRAGMA foreign_keys = ON')

    def close(self) -> None:
        self.connection.close()

    def execute_script(self, script: str) -> None:
        with self.connection:
            self.connection.executescript(script)

    def query(self, query: str, params: tuple = ()) -> List[Dict[str, Any]]:
        cursor = self.connection.execute(query, params)
        rows = cursor.fetchall()
        return [dict(row) for row in rows]

    def query_one(self, query: str, params: tuple = ()) -> Optional[Dict[str, Any]]:
        cursor = self.connection.execute(query, params)
        row = cursor.fetchone()
        return dict(row) if row else None

    def insert(self, query: str, params: tuple = ()) -> int:
        with self.connection:
            cursor = self.connection.execute(query, params)
            return cursor.lastrowid

    def insert_many(self, query: str, rows: List[tuple]) -> None:
        with self.connection:
            self.connection.executemany(query, rows)

    def get_projects(self) -> List[Dict[str, Any]]:
        return self.query(
            '''
            SELECT p.id AS id, p.project_id AS project_key, p.name, d.name AS department,
                   p.district AS location, p.budget_allocated AS budget, p.budget_spent AS spent,
                   p.progress AS completion, p.status, p.verified, p.description,
                   p.start_date || ' - ' || IFNULL(p.expected_end_date, '') AS timeline,
                   p.citizen_complaints AS feedback, p.category, p.contractor, p.delay_days,
                   p.actual_end_date
            FROM projects p
            LEFT JOIN departments d ON p.department_id = d.id
            '''
        )

    def get_project_by_id(self, project_id: int) -> Optional[Dict[str, Any]]:
        return self.query_one(
            '''
            SELECT p.id AS id, p.project_id AS project_key, p.name, d.name AS department,
                   p.district AS location, p.budget_allocated AS budget, p.budget_spent AS spent,
                   p.progress AS completion, p.status, p.verified, p.description,
                   p.start_date || ' - ' || IFNULL(p.expected_end_date, '') AS timeline,
                   p.citizen_complaints AS feedback, p.category, p.contractor, p.delay_days,
                   p.actual_end_date
            FROM projects p
            LEFT JOIN departments d ON p.department_id = d.id
            WHERE p.id = ?
            ''',
            (project_id,)
        )

    def get_departments(self) -> List[Dict[str, Any]]:
        return self.query('SELECT name, allocated_budget AS allocated, spent_budget AS spent, color FROM departments')

    def get_monthly_spending(self) -> List[Dict[str, Any]]:
        return self.query('SELECT month, spent, budgeted FROM monthly_spending ORDER BY rowid')

    def get_status_distribution(self) -> List[Dict[str, Any]]:
        return self.query('SELECT name, value FROM status_distribution')

    def get_budget_allocation(self) -> List[Dict[str, Any]]:
        return self.query('SELECT name, allocated_budget AS budget FROM departments')

    def get_notifications(self) -> List[Dict[str, Any]]:
        return self.query('SELECT id, title, type, time, read FROM notifications ORDER BY id DESC')

    def get_report_categories(self) -> List[Dict[str, Any]]:
        return self.query('SELECT name FROM report_categories ORDER BY name')

    def add_report_submission(self, category: str, description: str) -> Dict[str, Any]:
        report_id = self.insert(
            'INSERT INTO report_submissions (category, description) VALUES (?, ?)',
            (category, description)
        )
        return {'id': report_id, 'category': category, 'description': description, 'status': 'Submitted'}

    def get_chat_history(self) -> List[Dict[str, Any]]:
        return self.query('SELECT id, sender, message, timestamp FROM chat_messages ORDER BY id')

    def add_chat_message(self, sender: str, message: str, timestamp: str) -> Dict[str, Any]:
        chat_id = self.insert(
            'INSERT INTO chat_messages (sender, message, timestamp) VALUES (?, ?, ?)',
            (sender, message, timestamp)
        )
        return {'id': chat_id, 'sender': sender, 'message': message, 'timestamp': timestamp}

    def get_dashboard_overview(self) -> Optional[Dict[str, Any]]:
        return self.query_one('SELECT * FROM dashboard_overview')

    def get_users(self) -> List[Dict[str, Any]]:
        return self.query('SELECT id, name, email, role, email_notifications FROM users')

    def add_project(self, project: Dict[str, Any]) -> Dict[str, Any]:
        # Ensure department exists
        department_name = project.get('department') or project.get('department_name') or 'Unknown'
        self.insert('INSERT OR IGNORE INTO departments (name) VALUES (?)', (department_name,))
        dept = self.query_one('SELECT id FROM departments WHERE name = ?', (department_name,))
        department_id = dept['id'] if dept else None

        project_key = project.get('project_id') or f'P{int(time.time())}'
        budget = float(project.get('budget') or project.get('budget_allocated') or 0)
        spent = float(project.get('spent') or project.get('budget_spent') or 0)

        proj_id = self.insert(
            '''
            INSERT INTO projects (project_id, name, department_id, district, location, budget_allocated,
                budget_spent, progress, status, contractor, delay_days, citizen_complaints,
                start_date, expected_end_date, actual_end_date, verified, category, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''',
            (
                project_key,
                project.get('name'),
                department_id,
                project.get('district') or project.get('location'),
                project.get('location'),
                budget,
                spent,
                int(project.get('progress') or 0),
                project.get('status'),
                project.get('contractor'),
                int(project.get('delay_days') or 0),
                int(project.get('citizen_complaints') or 0),
                project.get('start_date'),
                project.get('expected_end_date'),
                project.get('actual_end_date'),
                1 if project.get('verified') else 0,
                project.get('category') or department_name,
                project.get('description') or ''
            )
        )
        return self.get_project_by_id(proj_id)

    def update_project(self, project_id: int, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        # Support updating department by name
        if 'department' in updates and updates['department']:
            dept_name = updates['department']
            self.insert('INSERT OR IGNORE INTO departments (name) VALUES (?)', (dept_name,))
            dept = self.query_one('SELECT id FROM departments WHERE name = ?', (dept_name,))
            updates['department_id'] = dept['id'] if dept else None

        # Map friendly keys
        mapping = {
            'budget': 'budget_allocated',
            'spent': 'budget_spent',
            'progress': 'progress'
        }
        set_parts = []
        params = []
        for key, value in updates.items():
            col = mapping.get(key, key)
            if col == 'department':
                continue
            if col == 'department_id':
                set_parts.append('department_id = ?')
                params.append(value)
                continue
            set_parts.append(f'{col} = ?')
            params.append(value)

        if not set_parts:
            return self.get_project_by_id(project_id)

        params.append(project_id)
        with self.connection:
            self.connection.execute(f"UPDATE projects SET {', '.join(set_parts)} WHERE id = ?", tuple(params))
        return self.get_project_by_id(project_id)

    def delete_project(self, project_id: int) -> bool:
        with self.connection:
            cursor = self.connection.execute('DELETE FROM projects WHERE id = ?', (project_id,))
            return cursor.rowcount > 0

    def load_csv_data(self) -> None:
        self.execute_script(Path(__file__).resolve().parent.joinpath('schema.sql').read_text())
        departments_map: Dict[str, int] = {}

        project_rows = []
        with open(RAW_DATA_DIR / 'projects.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                department_name = row.get('Department', 'Unknown').strip() or 'Unknown'
                if department_name not in departments_map:
                    self.insert(
                        'INSERT OR IGNORE INTO departments (name, allocated_budget, spent_budget, color, description) VALUES (?, ?, ?, ?, ?)',
                        (department_name, 0, 0, '#3b82f6', '')
                    )
                    department_record = self.query_one('SELECT id FROM departments WHERE name = ?', (department_name,))
                    dept_id = department_record['id'] if department_record else None
                    departments_map[department_name] = dept_id
                else:
                    dept_id = departments_map[department_name]

                allocated = float(row.get('Budget_Allocated_Lakhs', 0) or 0) * 100000
                spent = float(row.get('Budget_Spent_Lakhs', 0) or 0) * 100000
                verified = 1 if row.get('Status', '').strip() == 'Completed' else 0
                project_rows.append(
                    (
                        row.get('Project_ID'),
                        row.get('Project_Name'),
                        dept_id,
                        row.get('District'),
                        row.get('District'),
                        allocated,
                        spent,
                        int(row.get('Progress_Percentage') or 0),
                        row.get('Status'),
                        row.get('Contractor'),
                        int(row.get('Delay_Days') or 0),
                        int(row.get('Citizen_Complaints') or 0),
                        row.get('Start_Date'),
                        row.get('Expected_End_Date'),
                        row.get('Actual_End_Date'),
                        verified,
                        department_name,
                        ''
                    )
                )

        self.insert_many(
            '''
            INSERT OR IGNORE INTO projects (
                project_id, name, department_id, district, location, budget_allocated,
                budget_spent, progress, status, contractor, delay_days,
                citizen_complaints, start_date, expected_end_date,
                actual_end_date, verified, category, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''',
            project_rows
        )

        for department_name, department_id in departments_map.items():
            values = self.query_one(
                'SELECT SUM(budget_allocated) AS allocated, SUM(budget_spent) AS spent FROM projects WHERE department_id = ?',
                (department_id,)
            )
            with self.connection:
                self.connection.execute(
                    'UPDATE departments SET allocated_budget = ?, spent_budget = ? WHERE id = ?',
                    (values['allocated'] or 0, values['spent'] or 0, department_id)
                )

        with open(RAW_DATA_DIR / 'audit.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                project_key = row.get('Project_ID')
                project = self.query_one('SELECT id FROM projects WHERE project_id = ?', (project_key,))
                if project:
                    self.insert(
                        'INSERT OR IGNORE INTO audits (audit_id, project_id, allocated_budget, spent_budget, variance, audit_flag) VALUES (?, ?, ?, ?, ?, ?)',
                        (
                            row.get('Audit_ID'),
                            project['id'],
                            float(row.get('Allocated_Budget') or 0) * 100000,
                            float(row.get('Spent_Budget') or 0) * 100000,
                            float(row.get('Variance') or 0) * 100000,
                            1 if row.get('Audit_Flag', 'No').strip().lower() == 'yes' else 0
                        )
                    )

        with open(RAW_DATA_DIR / 'complaints.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                project_key = row.get('Project_ID')
                project = self.query_one('SELECT id FROM projects WHERE project_id = ?', (project_key,))
                if project:
                    self.insert(
                        'INSERT OR IGNORE INTO complaints (complaint_id, project_id, citizen_name, issue_type, complaint_date, status) VALUES (?, ?, ?, ?, ?, ?)',
                        (
                            row.get('Complaint_ID'),
                            project['id'],
                            row.get('Citizen_Name'),
                            row.get('Issue_Type'),
                            row.get('Complaint_Date'),
                            row.get('Status')
                        )
                    )

        self.insert_many(
            'INSERT OR IGNORE INTO report_categories (name) VALUES (?)',
            [
                ('Safety Concern',),
                ('Budget Issue',),
                ('Construction Delay',),
                ('Verification Question',),
                ('Other',)
            ]
        )

        self.insert_many(
            'INSERT OR IGNORE INTO notifications (title, type, time, read) VALUES (?, ?, ?, ?)',
            [
                ('Budget revision approved for Riverfront Park', 'Budget', '2h ago', 0),
                ('New citizen report submitted for Eastside School', 'Report', '5h ago', 0),
                ('Transit expansion schedule update', 'Project', '1d ago', 0),
                ('Verification completed for Downtown Health Hub', 'Verification', '2d ago', 0)
            ]
        )

        self.insert_many(
            'INSERT OR IGNORE INTO chat_messages (sender, message, timestamp) VALUES (?, ?, ?)',
            [
                ('user', 'What is the current status of the Downtown Health Hub project?', '09:10 AM'),
                ('ai', 'Downtown Health Hub is completed and verified with a 98% budget utilization rate.', '09:11 AM')
            ]
        )

        self.insert_many(
            'INSERT OR IGNORE INTO users (name, email, role, email_notifications) VALUES (?, ?, ?, ?)',
            [
                ('Admin User', 'admin@civictrack.gov', 'admin', 1)
            ]
        )

        self.insert_many(
            'INSERT OR IGNORE INTO monthly_spending (month, spent, budgeted) VALUES (?, ?, ?)',
            [
                ('Jan', 850000, 950000),
                ('Feb', 920000, 980000),
                ('Mar', 980000, 1050000),
                ('Apr', 1040000, 1100000),
                ('May', 1180000, 1200000),
                ('Jun', 1250000, 1280000)
            ]
        )
