"""
Central configuration for the Flask AI service, sourced from environment
variables (see .env.example) so model paths and thresholds never need to
be hardcoded or edited in source.
"""

import os
from dotenv import load_dotenv

load_dotenv()

WEAPON_MODEL_PATH = os.getenv("WEAPON_MODEL_PATH", "models/best.pt")
# Bare filename on purpose: if this exact path isn't found locally,
# Ultralytics will fetch the official pretrained yolov8n.pt automatically
# on first run (requires internet once, then it's cached).
PERSON_MODEL_PATH = os.getenv("PERSON_MODEL_PATH", "yolov8n.pt")

WEAPON_CONFIDENCE_THRESHOLD = float(os.getenv("WEAPON_CONFIDENCE_THRESHOLD", "0.35"))
PERSON_CONFIDENCE_THRESHOLD = float(os.getenv("PERSON_CONFIDENCE_THRESHOLD", "0.40"))

WHISPER_MODEL_SIZE = os.getenv("WHISPER_MODEL_SIZE", "tiny.en")
WHISPER_DEVICE = os.getenv("WHISPER_DEVICE", "cpu")
WHISPER_COMPUTE_TYPE = os.getenv("WHISPER_COMPUTE_TYPE", "int8")

CORS_ORIGINS = os.getenv("CORS_ORIGIN", "http://localhost:5000").split(",")

PORT = int(os.getenv("PORT", "6000"))
