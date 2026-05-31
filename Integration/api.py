from datetime import datetime
from typing import Optional
from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from Integration.database import DatabaseManager
from Integration.google_adk_client import generate_chat_response
from Integration.auth_config import require_admin_token

app = FastAPI(
    title='Budget Tracker Integration API',
    description='SQLite-backed API for budget projects, analytics, notifications, reports, and chat.',
    version='1.0.0'
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

db = DatabaseManager()


def admin_required(x_admin_token: Optional[str] = Header(None)):
    if not require_admin_token(x_admin_token or ''):
        raise HTTPException(status_code=401, detail='Admin token required')
    return True


class ProjectCreate(BaseModel):
    name: str
    department: Optional[str] = None
    location: Optional[str] = None
    district: Optional[str] = None
    budget: Optional[float] = 0
    spent: Optional[float] = 0
    progress: Optional[int] = 0
    status: Optional[str] = None
    contractor: Optional[str] = None
    delay_days: Optional[int] = 0
    citizen_complaints: Optional[int] = 0
    start_date: Optional[str] = None
    expected_end_date: Optional[str] = None
    actual_end_date: Optional[str] = None
    verified: Optional[bool] = False
    category: Optional[str] = None
    description: Optional[str] = None
    project_id: Optional[str] = None


@app.on_event('shutdown')
def shutdown_event() -> None:
    db.close()


@app.get('/api/projects')
def list_projects():
    return db.get_projects()


@app.get('/api/projects/{project_id}')
def get_project(project_id: int):
    project = db.get_project_by_id(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail='Project not found')
    return project


@app.get('/api/departments')
def list_departments():
    return db.get_departments()


@app.get('/api/analytics/budget-allocation')
def budget_allocation():
    return db.get_budget_allocation()


@app.get('/api/analytics/monthly-spending')
def monthly_spending():
    return db.get_monthly_spending()


@app.get('/api/analytics/status-distribution')
def status_distribution():
    return db.get_status_distribution()


@app.get('/api/dashboard/overview')
def dashboard_overview():
    overview = db.get_dashboard_overview()
    if overview is None:
        raise HTTPException(status_code=404, detail='Dashboard overview not available')
    return overview


@app.get('/api/report-categories')
def report_categories():
    categories = db.get_report_categories()
    return [item['name'] for item in categories]


@app.get('/api/notifications')
def notifications():
    return db.get_notifications()


class ReportSubmission(BaseModel):
    category: str
    description: str


@app.post('/api/reports')
def submit_report(report: ReportSubmission):
    return db.add_report_submission(report.category, report.description)


@app.get('/api/chat/history')
def chat_history():
    return db.get_chat_history()


class ChatMessageInput(BaseModel):
    message: str


@app.post('/api/chat/messages')
def post_chat_message(payload: ChatMessageInput):
    timestamp = datetime.now().strftime('%I:%M %p')
    db.add_chat_message('user', payload.message, timestamp)
    try:
        assistant_text = generate_chat_response(payload.message)
    except Exception as exc:
        assistant_text = f'Sorry, I could not generate a reply right now. {str(exc)}'
    assistant_entry = db.add_chat_message('ai', assistant_text, timestamp)
    return assistant_entry


@app.post('/api/projects', dependencies=[Depends(admin_required)])
def create_project(project: ProjectCreate):
    created = db.add_project(project.dict())
    return created


@app.put('/api/projects/{project_id}', dependencies=[Depends(admin_required)])
def update_project(project_id: int, updates: ProjectCreate):
    updated = db.update_project(project_id, updates.dict())
    if not updated:
        raise HTTPException(status_code=404, detail='Project not found')
    return updated


@app.delete('/api/projects/{project_id}', dependencies=[Depends(admin_required)])
def delete_project(project_id: int):
    ok = db.delete_project(project_id)
    if not ok:
        raise HTTPException(status_code=404, detail='Project not found')
    return {'deleted': True}
