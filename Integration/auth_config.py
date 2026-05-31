import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', '').strip()

def require_admin_token(token: str) -> bool:
    """Return True if provided token matches configured admin token."""
    if not ADMIN_TOKEN:
        # If no admin token configured, deny by default
        return False
    return token == ADMIN_TOKEN
