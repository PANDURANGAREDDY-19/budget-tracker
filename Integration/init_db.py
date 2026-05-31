import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from database import DatabaseManager


def main() -> None:
    db_path = ROOT / 'budget_tracker.db'
    print(f'Initializing SQLite database at: {db_path}')
    manager = DatabaseManager(db_path)
    try:
        manager.load_csv_data()
        print('Database initialization complete.')
        print('Tables created: departments, projects, audits, complaints, notifications, report_categories, report_submissions, chat_messages, users, monthly_spending')
    finally:
        manager.close()


if __name__ == '__main__':
    main()
