import base64
import os
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

ROBOFLOW_MODEL_ID = "weapon-detection-system-v2-10jxt/3"
ROBOFLOW_API_URL = "https://serverless.roboflow.com"


class VisionServiceError(Exception):
    pass


async def detect_objects(image_bytes: bytes) -> dict[str, Any]:
    """Send an image to the hosted Roboflow object-detection model."""

    api_key = os.getenv("ROBOFLOW_API_KEY")

    if not api_key:
        raise VisionServiceError("Roboflow API key is not configured.")

    if not image_bytes:
        raise VisionServiceError("The uploaded image is empty.")

    encoded_image = base64.b64encode(image_bytes).decode("utf-8")

    endpoint = f"{ROBOFLOW_API_URL}/{ROBOFLOW_MODEL_ID}"

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                endpoint,
                params={"api_key": api_key},
                content=encoded_image,
                headers={
                    "Content-Type": "application/x-www-form-urlencoded"
                },
            )

        response.raise_for_status()
        result = response.json()

    except httpx.HTTPStatusError as exc:
        raise VisionServiceError(
            f"Roboflow returned HTTP {exc.response.status_code}."
        ) from exc
    except httpx.RequestError as exc:
        raise VisionServiceError(
            "Could not connect to the Roboflow inference service."
        ) from exc
    except ValueError as exc:
        raise VisionServiceError(
            "Roboflow returned an invalid JSON response."
        ) from exc

    predictions = result.get("predictions")

    if not isinstance(predictions, list):
        raise VisionServiceError(
            "Roboflow response did not contain a predictions list."
        )

    normalized = []

    for prediction in predictions:
        if not isinstance(prediction, dict):
            continue

        label = str(prediction.get("class", "")).strip().lower()

        try:
            confidence = float(prediction.get("confidence", 0))
        except (TypeError, ValueError):
            continue

        if not label or not 0 <= confidence <= 1:
            continue

        normalized.append({
            "label": label,
            "confidence": confidence,
            "x": prediction.get("x"),
            "y": prediction.get("y"),
            "width": prediction.get("width"),
            "height": prediction.get("height"),
        })

    return {
        "predictions": normalized,
        "image": result.get("image", {}),
        "model": ROBOFLOW_MODEL_ID,
    }
