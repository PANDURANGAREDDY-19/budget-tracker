import google.generativeai as genai

from .adk_config import GOOGLE_ADK_API_KEY, GOOGLE_ADK_MODEL, FALLBACK_MODELS, require_api_key


def _get_available_model():
    """Get the first available model that supports generateContent."""
    try:
        genai.configure(api_key=GOOGLE_ADK_API_KEY)
        models = genai.list_models()
        available_models = [model.name.split('/')[-1] for model in models 
                           if 'generateContent' in model.supported_generation_methods]
        # Try configured model first, then fallbacks
        for model_name in [GOOGLE_ADK_MODEL] + FALLBACK_MODELS:
            if model_name in available_models:
                return model_name
        # If no fallback matches, use the first available
        return available_models[0] if available_models else GOOGLE_ADK_MODEL
    except Exception:
        # If listing fails, try configured model
        return GOOGLE_ADK_MODEL


def generate_chat_response(prompt: str) -> str:
    """Generate a chat response using Google Generative AI (Gemini)."""
    try:
        require_api_key()
    except EnvironmentError as e:
        # Fallback mock response for development without valid API key
        return f"[Demo Mode - No API Key] I received your question: '{prompt[:80]}...' but I need a real Google API key to respond. Please set GOOGLE_ADK_API_KEY in Integration/.env"
    
    try:
        # Configure the API with the key
        genai.configure(api_key=GOOGLE_ADK_API_KEY)
        
        # Get an available model
        model_name = _get_available_model()
        
        # Initialize the model
        model = genai.GenerativeModel(model_name)
        
        # Generate response
        response = model.generate_content(prompt, stream=False)
        
        # Extract text from response
        if response.text:
            return response.text
        else:
            return "[API Response] No text content in response. The model may have filtered the content."
            
    except Exception as e:
        error_msg = str(e)
        return f"[Error] Could not generate response: {error_msg}"
