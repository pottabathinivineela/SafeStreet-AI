"""
Image decoding helper for the Flask AI service.

Keeping this separate from vision_service.py means the inference code
never has to know how the bytes arrived (upload, camera frame, future
video-frame extraction, etc.) — it always just gets a decoded BGR array.
"""

import numpy as np
import cv2


def decode_image(raw_bytes: bytes):
    """
    Decodes raw image bytes (JPEG/PNG/etc.) into an OpenCV BGR array.
    Returns None if the bytes could not be decoded as an image.
    """
    if not raw_bytes:
        return None

    buffer = np.frombuffer(raw_bytes, dtype=np.uint8)
    image = cv2.imdecode(buffer, cv2.IMREAD_COLOR)
    return image
