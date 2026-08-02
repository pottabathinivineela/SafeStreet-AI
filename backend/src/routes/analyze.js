// ---------------------------------------------------------------------------
// /api/analyze-* routes
// ---------------------------------------------------------------------------
// Every route: (1) validates the upload, (2) forwards it to the Flask AI
// service for real inference, (3) scores the result via threatEngine,
// (4) returns the exact JSON contract the frontend expects. If Flask is
// unreachable or fails, the route returns a 502 — it never invents a
// result.
// ---------------------------------------------------------------------------

import { Router } from 'express';
import { uploadImage, uploadAudio } from '../middleware/upload.js';
import { requestVisionDetection, requestAudioTranscription } from '../services/aiServiceClient.js';
import { buildVisualResult, buildAudioResult } from '../utils/threatEngine.js';
import { sendAlertEmail } from '../services/emailService.js';
import fs from "fs-extra";
import path from "path";

const router = Router();

function handleUploadError(err, _req, res, next) {
  if (err) return res.status(400).json({ error: err.message });
  next();
}

// POST /api/analyze-image — full-resolution uploaded photo
router.post('/analyze-image', uploadImage.single('image'), handleUploadError, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image file provided.' });

  try {
    const raw = await requestVisionDetection(
    req.file.buffer,
    req.file.originalname || 'upload.jpg',
    req.file.mimetype
);

const result = buildVisualResult(raw);

const latitude = req.body.latitude;
const longitude = req.body.longitude;


// Save uploaded image
const imageName = Date.now() + ".jpg";

const imagePath = path.join("uploads", imageName);

await fs.writeFile(imagePath, req.file.buffer);
result.location = {
    lat: Number(latitude),
    lng: Number(longitude),
};
// Temporary location


// Attach image path
result.imagePath = imagePath;

if (result.sendAlert) {
    await sendAlertEmail(result);
}

res.json(result);
  } catch (err) {
    console.error('[analyze-image] AI service call failed:', err.message);
    res.status(502).json({ error: 'Image analysis failed. Is the Flask AI service running?' });
  }
});

// POST /api/analyze-camera-frame — single frame captured from the live webcam
router.post('/analyze-camera-frame', uploadImage.single('frame'), handleUploadError, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No frame provided.' });

  try {
    const raw = await requestVisionDetection(
    req.file.buffer,
    'frame.jpg',
    req.file.mimetype
);

const result = buildVisualResult(raw);

const latitude = req.body.latitude;
const longitude = req.body.longitude;

result.location = {
    lat: Number(latitude),
    lng: Number(longitude),
};
// Save uploaded image

// Attach image path
result.imagePath = imagePath;
console.log(result.location);
if (result.sendAlert) {
    await sendAlertEmail(result);
}

res.json(result);
  } catch (err) {
    console.error('[analyze-camera-frame] AI service call failed:', err.message);
    res.status(502).json({ error: 'Camera frame analysis failed. Is the Flask AI service running?' });
  }
});

// POST /api/analyze-audio — a short recorded audio segment
router.post('/analyze-audio', uploadAudio.single('audio'), handleUploadError, async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio file provided.' });
const latitude = req.body.latitude;

const longitude = req.body.longitude;
  try {
    const { transcript } = await requestAudioTranscription(
      req.file.buffer,
      req.file.originalname || 'segment.webm',
      req.file.mimetype,
    );
    const result = buildAudioResult(transcript);
    const latitude = req.body.latitude;
const longitude = req.body.longitude;

result.location = {
    lat: Number(latitude),
    lng: Number(longitude),
};
console.log(result.location);
if (result.sendAlert) {
    await sendAlertEmail(result);
}

res.json(result);
    
  } catch (err) {
    console.error('[analyze-audio] AI service call failed:', err.message);
    res.status(502).json({ error: 'Audio analysis failed. Is the Flask AI service running?' });
  }
});

export default router;
