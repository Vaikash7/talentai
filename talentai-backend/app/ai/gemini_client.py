import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = "gemini-flash-latest"

_client = None


def get_client():
    global _client
    if _client is None:
        if not GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not set. Check your .env file.")
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


class GeminiUnavailableError(Exception):
    """Raised when the Gemini API call fails for any reason (no key,
    quota exceeded, network issue, invalid response, etc.), so calling
    code can gracefully fall back to the existing rule-based logic."""
    pass


def call_gemini(prompt: str) -> str:
    """
    Sends a single prompt to Gemini and returns the raw text response.
    Raises GeminiUnavailableError on any failure so callers can fall
    back to rule-based logic instead of crashing.
    """
    try:
        client = get_client()
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )
        if not response or not response.text:
            raise GeminiUnavailableError("Gemini returned an empty response.")
        return response.text
    except GeminiUnavailableError:
        raise
    except Exception as e:
        raise GeminiUnavailableError(f"Gemini API call failed: {str(e)}") from e


def call_gemini_json(prompt: str) -> dict:
    """
    Sends a prompt expecting a structured JSON response, parses it,
    and returns a dict. Raises GeminiUnavailableError if the call
    fails OR if the response isn't valid JSON (so callers always
    get either a clean dict or a clear failure to fall back on).
    """
    raw_text = call_gemini(prompt)

    # Strip markdown code fences if Gemini wrapped the JSON in ```json ... ```
    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise GeminiUnavailableError(f"Gemini returned invalid JSON: {str(e)}") from e