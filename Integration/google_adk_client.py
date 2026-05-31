try:
    from google import genai
    _GENAI_AVAILABLE = True
except ModuleNotFoundError:
    genai = None
    _GENAI_AVAILABLE = False

from .adk_config import GOOGLE_ADK_API_KEY, GOOGLE_ADK_MODEL, FALLBACK_MODELS, require_api_key


def _get_available_model(client):
    """Get the first available model that supports generateContent."""
    try:
        models = client.models.list()
        available_models = [
            model.name.split('/')[-1] for model in models
            if hasattr(model, 'supported_actions') and 'generateContent' in (model.supported_actions or [])
        ]
        for model_name in [GOOGLE_ADK_MODEL] + FALLBACK_MODELS:
            if model_name in available_models:
                return model_name
        return available_models[0] if available_models else GOOGLE_ADK_MODEL
    except Exception:
        return GOOGLE_ADK_MODEL


def generate_chat_response(prompt: str) -> str:
    """Generate a chat response using Google GenAI (Gemini)."""
    if not _GENAI_AVAILABLE:
        return f"[Offline Demo] I received your question: '{prompt[:80]}...' but the google-genai package is not installed. Install google-genai or set GOOGLE_ADK_API_KEY to enable live responses."

    try:
        require_api_key()
    except EnvironmentError:
        return f"[Demo Mode - No API Key] I received your question: '{prompt[:80]}...' but I need a real Google API key to respond. Please set GOOGLE_ADK_API_KEY in Integration/.env"

    try:
        client = genai.Client(api_key=GOOGLE_ADK_API_KEY)
        model_name = _get_available_model(client)
        response = client.models.generate_content(model=model_name, contents=prompt)

        if response.text:
            return response.text
        return "[API Response] No text content in response. The model may have filtered the content."

    except Exception as e:
        return f"[Error] Could not generate response: {str(e)}"
