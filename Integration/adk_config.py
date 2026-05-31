import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / '.env')

GOOGLE_ADK_API_KEY = os.getenv('GOOGLE_ADK_API_KEY', '').strip()
GOOGLE_ADK_MODEL = os.getenv('GOOGLE_ADK_MODEL', 'gemini-pro').strip()
# Fallback models to try if primary model is not available
FALLBACK_MODELS = ['gemini-pro', 'gemini-pro-vision', 'gemini-1.5-pro', 'gemini-1.5-flash']


def require_api_key() -> None:
    if not GOOGLE_ADK_API_KEY:
        raise EnvironmentError(
            'Missing GOOGLE_ADK_API_KEY in Integration/.env or environment variables. '
            'Get your API key from https://aistudio.google.com/app/apikey'
        )
