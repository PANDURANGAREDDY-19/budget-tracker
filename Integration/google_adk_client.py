import requests

from .adk_config import GOOGLE_ADK_API_KEY, GOOGLE_ADK_ENDPOINT, require_api_key


def _extract_response_text(response_data: dict) -> str:
    candidate = response_data.get('candidates')
    if isinstance(candidate, list) and candidate:
        candidate = candidate[0]
        if isinstance(candidate, dict):
            if message := candidate.get('message'):
                contents = message.get('content')
            else:
                contents = candidate.get('content')
            if isinstance(contents, list) and contents:
                first = contents[0]
                return first.get('text') or first.get('content') or str(first)
            return candidate.get('content') or str(candidate)
    if text := response_data.get('text'):
        return text
    return str(response_data)


def generate_chat_response(prompt: str) -> str:
    try:
        require_api_key()
    except EnvironmentError:
        # Fallback mock response for development without valid API key
        return f"[Demo Mode - No API Key] I received your question: '{prompt[:80]}...' but I need a real Google API key to respond. Please set GOOGLE_ADK_API_KEY in Integration/.env"
    
    payload = {
        'prompt': {
            'messages': [
                {
                    'author': 'user',
                    'content': [
                        {
                            'type': 'text',
                            'text': prompt
                        }
                    ]
                }
            ]
        }
    }
    params = {'key': GOOGLE_ADK_API_KEY}
    try:
        response = requests.post(GOOGLE_ADK_ENDPOINT, params=params, json=payload, timeout=20)
        response.raise_for_status()
        data = response.json()
        return _extract_response_text(data)
    except requests.exceptions.HTTPError as e:
        return f"[API Error] Chatbot unavailable ({response.status_code}). Check GOOGLE_ADK_API_KEY and endpoint in Integration/.env"
    except Exception as e:
        return f"[Error] Could not generate response: {str(e)}"
