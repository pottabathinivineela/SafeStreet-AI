"""
SafeStreet AI — Flask AI service.

Two endpoints, both real inference, no simulated output:

  POST /detect        -> runs weapon + person YOLOv8 models on an image
  POST /detect-audio   -> transcribes an audio segment with faster-whisper

This file intentionally contains no "risk level" or "recommendation"
logic — that business logic lives in the Express backend, which is the
orchestration layer that talks to this service. Flask's only job is to
load the models once and return honest raw detection data.
"""

import io
import logging

from flask import Flask, request, jsonify
from flask_cors import CORS

import config
from services.vision_service import VisionService
from services.audio_service import AudioService
from utils.image_utils import decode_image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("safestreet-ai-service")

app = Flask(__name__)
CORS(app, origins=config.CORS_ORIGINS)

# ---------------------------------------------------------------------------
# Models are loaded exactly once, here, at process startup — not per
# request. This is what keeps per-frame latency low enough for a live
# camera feed on modest hardware.
# ---------------------------------------------------------------------------
logger.info("Starting SafeStreet AI service — loading models (this happens once)...")
vision_service = VisionService(
    weapon_model_path=config.WEAPON_MODEL_PATH,
    person_model_path=config.PERSON_MODEL_PATH,
    weapon_conf=config.WEAPON_CONFIDENCE_THRESHOLD,
    person_conf=config.PERSON_CONFIDENCE_THRESHOLD,
)
audio_service = AudioService(
    model_size=config.WHISPER_MODEL_SIZE,
    device=config.WHISPER_DEVICE,
    compute_type=config.WHISPER_COMPUTE_TYPE,
)
logger.info("All models loaded. SafeStreet AI service is ready.")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "safestreet-ai-service"})


@app.route("/detect", methods=["POST"])
def detect():
    """Runs weapon + person detection on a single uploaded image/frame."""
    if "image" not in request.files:
        return jsonify({"error": "No image file provided under field name 'image'."}), 400

    raw_bytes = request.files["image"].read()
    image = decode_image(raw_bytes)
    if image is None:
        return jsonify({"error": "Could not decode the uploaded image."}), 400

    try:
        result = vision_service.detect(image)
        return jsonify(result)
    except Exception:
        logger.exception("Vision inference failed")
        return jsonify({"error": "Vision inference failed."}), 500


@app.route("/detect-audio", methods=["POST"])
def detect_audio():
    """Transcribes a short recorded audio segment with faster-whisper."""
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided under field name 'audio'."}), 400

    raw_bytes = request.files["audio"].read()
    if not raw_bytes:
        return jsonify({"error": "Empty audio file."}), 400

    try:
        transcript = audio_service.transcribe(io.BytesIO(raw_bytes))
        return jsonify({"transcript": transcript})
    except Exception:
        logger.exception("Audio transcription failed")
        return jsonify({"error": "Audio transcription failed."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=config.PORT)
