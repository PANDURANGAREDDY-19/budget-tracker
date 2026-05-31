# Integration Layer for Budget Tracker

This folder contains the SQLite database schema and a lightweight FastAPI integration layer that exposes the budget tracker dataset to a frontend UI.

## Purpose
- Store budget, project, audit, complaint, notification, report, chat, and user data in SQLite.
- Provide REST endpoints that mirror the existing frontend service payload shapes.
- Keep all integration code inside `Integration/` so existing frontend files remain unchanged.
- Support admin-only write operations (create/update/delete projects) with token-based authentication.

## Files
- `schema.sql` - SQLite schema definitions for tables and views.
- `database.py` - Database helper class, CSV import logic, and query methods.
- `init_db.py` - Bootstrap script to initialize `budget_tracker.db` from `Database/raw_data`.
- `api.py` - FastAPI server exposing endpoints for projects, analytics, notifications, reports, and chat.
- `auth_config.py` - Admin token validation for protected write operations.
- `adk_config.py` - Google Generative AI API configuration.
- `google_adk_client.py` - Client for Gemini API with fallback demo mode.
- `requirements.txt` - Python dependencies for the integration layer.

## Schema Design
Tables created:
- `departments`
- `projects`
- `audits`
- `complaints`
- `notifications`
- `report_categories`
- `report_submissions`
- `chat_messages`
- `users`
- `monthly_spending`

Views created:
- `dashboard_overview`
- `status_distribution`
- `department_expenditure`

## Setup

### 1. Install Dependencies
```bash
python -m pip install -r Integration/requirements.txt
```

### 2. Configure Environment Variables
Copy the example config and update it with your credentials:
```bash
cp Integration/.env.example Integration/.env
```

Edit `Integration/.env`:
```env
# Get a free API key from https://aistudio.google.com/app/apikey
GOOGLE_ADK_API_KEY=your-real-google-api-key
GOOGLE_ADK_MODEL=gemini-1.5-flash
GOOGLE_ADK_ENDPOINT=https://generativelanguage.googleapis.com/v1beta2/models/gemini-1.5-flash:generateText

# Set a secure admin token for protecting write operations
ADMIN_TOKEN=your-secure-admin-token-here
```

**Note on Chatbot API Key:**
- Get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey)
- Without a valid key, the chatbot will run in **demo mode** and show a helpful message
- The API endpoint uses Google's Generative AI (Gemini) API

### 3. Initialize the Database
```bash
python Integration/init_db.py
```

### 4. Start the API Server
```bash
uvicorn Integration.api:app --reload
```

The server runs on `http://localhost:8000` by default.

## API Endpoints

### Read Operations (Public)
- `GET /api/projects` — List all projects
- `GET /api/projects/{project_id}` — Get project details
- `GET /api/departments` — List departments
- `GET /api/analytics/budget-allocation` — Budget by department
- `GET /api/analytics/monthly-spending` — Monthly spending trends
- `GET /api/analytics/status-distribution` — Project status breakdown
- `GET /api/dashboard/overview` — Dashboard summary data
- `GET /api/report-categories` — Available report types
- `GET /api/notifications` — Notifications list
- `GET /api/chat/history` — Chat message history
- `POST /api/chat/messages` — Send chat message (uses Gemini API)
  ```json
  { "message": "What is the status of the Downtown project?" }
  ```

### Write Operations (Admin-Protected)
All write endpoints require the `X-Admin-Token` header:
```
X-Admin-Token: your-admin-token-from-env
```

- `POST /api/projects` — Create a new project
  ```json
  {
    "name": "Project Name",
    "department": "Infrastructure",
    "location": "Downtown",
    "budget": 5000000,
    "spent": 2500000,
    "progress": 50,
    "status": "In Progress",
    "category": "Public Works"
  }
  ```

- `PUT /api/projects/{project_id}` — Update a project
  ```json
  { "status": "Completed", "progress": 100, "spent": 4800000 }
  ```

- `DELETE /api/projects/{project_id}` — Delete a project

### Example Admin Requests
```bash
# Create a project
curl -X POST http://localhost:8000/api/projects \
  -H "X-Admin-Token: your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Park",
    "department": "Parks",
    "location": "Eastside",
    "budget": 1000000,
    "progress": 0,
    "status": "Planning"
  }'

# Update a project
curl -X PUT http://localhost:8000/api/projects/1 \
  -H "X-Admin-Token: your-admin-token" \
  -H "Content-Type: application/json" \
  -d '{ "status": "Completed", "progress": 100 }'

# Delete a project
curl -X DELETE http://localhost:8000/api/projects/1 \
  -H "X-Admin-Token: your-admin-token"
```

## Security Notes
- **Admin Token**: Keep the `ADMIN_TOKEN` secret. Use environment variables, not hardcoded values.
- **HTTPS**: In production, run the API over HTTPS (TLS) to protect tokens in transit.
- **Demo Mode**: Without a valid Google API key, the chatbot runs in demo mode and returns mock responses.
- **Development**: For local development, you can set `VITE_ADMIN_TOKEN` in the frontend environment to auto-include the token in requests.

## Notes
- Budget values are imported from `Database/raw_data/projects.csv` and converted from lakhs into base currency units.
- The API payloads are intentionally designed to match existing frontend service expectations so that future wiring is minimal.
- Admin token validation is stateless and token-based (suitable for development; use JWT or OAuth for production).
