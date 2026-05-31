import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', '').strip()
DEFAULT_ADMIN_TOKEN = 'CivicTrack123!'

def require_admin_token(token: str) -> bool:
    """Return True if provided token matches configured admin token."""
    if ADMIN_TOKEN:
        return token == ADMIN_TOKEN
    return token == DEFAULT_ADMIN_TOKEN
