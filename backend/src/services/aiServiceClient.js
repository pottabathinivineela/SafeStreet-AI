// ---------------------------------------------------------------------------
// AI service client — the only place in the backend that talks to the
// Flask AI service. Everything else (routes, threat engine) just consumes
// what this returns. If you ever move inference somewhere else (a
// different host, a queue, a GPU box), this is the only file to change.
// ---------------------------------------------------------------------------

import axios from 'axios';
import FormData from 'form-data';

const FLASK_AI_URL = process.env.FLASK_AI_URL || 'http://localhost:6000';

/**
 * Sends an image (upload or camera frame) to Flask's /detect endpoint.
 * Returns raw `{ weapons: [...], persons: {...} }` — throws on failure,
 * never fabricates a result.
 */
export async function requestVisionDetection(buffer, filename, mimeType) {
  const form = new FormData();
  form.append('image', buffer, { filename, contentType: mimeType || 'image/jpeg' });

  const response = await axios.post(`${FLASK_AI_URL}/detect`, form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 20000,
  });

  return response.data;
}

/**
 * Sends a recorded audio segment to Flask's /detect-audio endpoint.
 * Returns `{ transcript: string }` — throws on failure.
 */
export async function requestAudioTranscription(buffer, filename, mimeType) {
  const form = new FormData();
  form.append('audio', buffer, { filename, contentType: mimeType || 'audio/webm' });

  const response = await axios.post(`${FLASK_AI_URL}/detect-audio`, form, {
    headers: form.getHeaders(),
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    timeout: 30000,
  });

  return response.data;
}

/** Used by GET /api/health to report whether the AI service is reachable. */
export async function pingAiService() {
  try {
    const response = await axios.get(`${FLASK_AI_URL}/health`, { timeout: 3000 });
    return response.status === 200;
  } catch {
    return false;
  }
}
