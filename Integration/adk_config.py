import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

GOOGLE_ADK_API_KEY = os.getenv('GOOGLE_ADK_API_KEY', '').strip()
GOOGLE_ADK_MODEL = os.getenv('GOOGLE_ADK_MODEL', 'chat-bison-001').strip()
GOOGLE_ADK_ENDPOINT = os.getenv(
    'GOOGLE_ADK_ENDPOINT',
    f'https://generativelanguage.googleapis.com/v1beta2/models/{GOOGLE_ADK_MODEL}:generateMessage'
).strip()


def require_api_key() -> None:
    if not GOOGLE_ADK_API_KEY:
        raise EnvironmentError(
            'Missing GOOGLE_ADK_API_KEY in Integration/.env or environment variables. '
            'Create Integration/.env from Integration/.env.example and set your key.'
        )
