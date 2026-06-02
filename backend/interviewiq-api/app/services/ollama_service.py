import json
import os
from typing import Any, Dict

import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


class OllamaServiceError(Exception):
    """Raised when Ollama fails or returns an invalid response."""


def call_ollama_json(system_prompt: str, user_prompt: str) -> Dict[str, Any]:
    """
    Sends a prompt to Ollama and expects a JSON object back.

    Ollama must be installed and running locally.
    Default URL: http://localhost:11434
    """

    url = f"{OLLAMA_BASE_URL}/api/chat"

    payload = {
        "model": OLLAMA_MODEL,
        "stream": False,
        "format": "json",
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": user_prompt,
            },
        ],
    }

    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise OllamaServiceError(
            "Could not connect to Ollama. Make sure Ollama is installed, running, "
            f"and that the model '{OLLAMA_MODEL}' has been pulled."
        ) from exc

    data = response.json()
    content = data.get("message", {}).get("content")

    if not content:
        raise OllamaServiceError("Ollama returned an empty response.")

    try:
        parsed = json.loads(content)
    except json.JSONDecodeError as exc:
        raise OllamaServiceError("Ollama did not return valid JSON.") from exc

    if not isinstance(parsed, dict):
        raise OllamaServiceError("Ollama returned JSON, but it was not an object.")

    return parsed