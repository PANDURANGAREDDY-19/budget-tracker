-- SQLite schema for the Civic Budget Tracker integration layer

CREATE TABLE IF NOT EXISTS departments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  allocated_budget REAL NOT NULL DEFAULT 0,
  spent_budget REAL NOT NULL DEFAULT 0,
  color TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  district TEXT,
  location TEXT,
  budget_allocated REAL NOT NULL DEFAULT 0,
  budget_spent REAL NOT NULL DEFAULT 0,
  progress INTEGER DEFAULT 0,
  status TEXT,
  contractor TEXT,
  delay_days INTEGER DEFAULT 0,
  citizen_complaints INTEGER DEFAULT 0,
  start_date TEXT,
  expected_end_date TEXT,
  actual_end_date TEXT,
  verified INTEGER DEFAULT 0,
  category TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS audits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  audit_id TEXT NOT NULL UNIQUE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  allocated_budget REAL NOT NULL DEFAULT 0,
  spent_budget REAL NOT NULL DEFAULT 0,
  variance REAL NOT NULL DEFAULT 0,
  audit_flag INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS complaints (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  complaint_id TEXT NOT NULL UNIQUE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  citizen_name TEXT,
  issue_type TEXT,
  complaint_date TEXT,
  status TEXT
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  type TEXT,
  time TEXT,
  read INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS report_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS report_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status TEXT NOT NULL DEFAULT 'Submitted'
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT,
  email_notifications INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS monthly_spending (
  month TEXT PRIMARY KEY,
  spent REAL NOT NULL DEFAULT 0,
  budgeted REAL NOT NULL DEFAULT 0
);

CREATE VIEW IF NOT EXISTS dashboard_overview AS
SELECT
  COUNT(*) AS total_projects,
  SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS active_projects,
  SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_projects,
  SUM(CASE WHEN status = 'Delayed' THEN 1 ELSE 0 END) AS delayed_projects,
  SUM(CASE WHEN verified = 1 THEN 1 ELSE 0 END) AS verified_projects,
  (
    SELECT COUNT(*) FROM report_submissions
  ) AS citizen_reports
FROM projects;

CREATE VIEW IF NOT EXISTS status_distribution AS
SELECT status AS name, COUNT(*) AS value
FROM projects
GROUP BY status;

CREATE VIEW IF NOT EXISTS department_expenditure AS
SELECT d.name AS name, d.spent_budget AS spent
FROM departments d;
