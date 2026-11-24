from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.services.vision_service import (
    detect_objects,
    VisionServiceError,
)
from app.utils.threat_engine import assess_visual_threat
from app.services.audio_service import transcribe_audio, AudioServiceError
from app.utils.audio_threat_engine import assess_audio_threat


app = FastAPI(
    title="SafeStreet AI API",
    description="AI-powered public safety monitoring backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "project": "SafeStreet AI",
        "message": "Backend is running",
        "status": "online",
    }


@app.get("/api/health")
async def health():
    return {
        "status": "healthy",
        "service": "SafeStreet AI API",
    }


async def analyze_uploaded_image(upload: UploadFile):
    image_bytes = await upload.read()

    if not image_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded image is empty.",
        )

    try:
        vision_result = await detect_objects(image_bytes)

    except VisionServiceError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    detections = vision_result["predictions"]
    threat = assess_visual_threat(detections)

    return {
        **threat,
        "detections": detections,
        "model": vision_result["model"],
        "image": vision_result["image"],
    }


@app.post("/api/analyze-image")
async def analyze_image(
    image: UploadFile = File(...),
    latitude: float | None = Form(default=None),
    longitude: float | None = Form(default=None),
):
    result = await analyze_uploaded_image(image)

    result["source"] = "image"
    result["location"] = {
        "latitude": latitude,
        "longitude": longitude,
    }

    return result


@app.post("/api/analyze-camera-frame")
async def analyze_camera_frame(
    frame: UploadFile = File(...),
):
    result = await analyze_uploaded_image(frame)
    result["source"] = "camera"

    return result


@app.post("/api/analyze-audio")
async def analyze_audio(audio: UploadFile = File(...)):
    audio_bytes = await audio.read()

    if not audio_bytes:
        raise HTTPException(
            status_code=400,
            detail="Uploaded audio is empty.",
        )

    try:
        transcript = await transcribe_audio(
            audio_bytes,
            audio.filename or "recording.webm",
            audio.content_type or "audio/webm",
        )
    except AudioServiceError as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        ) from exc

    return assess_audio_threat(transcript)
