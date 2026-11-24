import os
from pathlib import Path

import httpx
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

GROQ_API_URL = "https://api.groq.com/openai/v1/audio/transcriptions"
GROQ_MODEL = "whisper-large-v3-turbo"
MAX_AUDIO_SIZE = 25 * 1024 * 1024


class AudioServiceError(Exception):
    pass


async def transcribe_audio(
    audio_bytes: bytes,
    filename: str = "recording.webm",
    content_type: str = "audio/webm",
) -> str:
    """Transcribe an uploaded audio segment using Groq Whisper."""

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise AudioServiceError("Groq API key is not configured.")

    if not audio_bytes:
        raise AudioServiceError("Uploaded audio is empty.")

    if len(audio_bytes) > MAX_AUDIO_SIZE:
        raise AudioServiceError("Audio file exceeds the 25 MB limit.")

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                },
                data={
                    "model": GROQ_MODEL,
                    "response_format": "json",
                    "temperature": "0",
                },
                files={
                    "file": (
                        filename,
                        audio_bytes,
                        content_type,
                    ),
                },
            )

        response.raise_for_status()
        result = response.json()

    except httpx.HTTPStatusError as exc:
        raise AudioServiceError(
            f"Groq transcription failed with HTTP {exc.response.status_code}."
        ) from exc

    except httpx.RequestError as exc:
        raise AudioServiceError(
            "Could not connect to the Groq transcription service."
        ) from exc

    except ValueError as exc:
        raise AudioServiceError(
            "Groq returned an invalid response."
        ) from exc

    transcript = result.get("text")

    if not isinstance(transcript, str):
        raise AudioServiceError(
            "Groq response did not contain a transcript."
        )

    return transcript.strip()
