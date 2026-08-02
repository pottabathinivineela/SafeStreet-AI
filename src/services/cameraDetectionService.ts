// ---------------------------------------------------------------------------
// Camera detection service — sends one live webcam frame to the real
// backend vision endpoint (POST /analyze-camera-frame). Called on an
// interval by CameraDetection.tsx only while the camera is switched on.
// ---------------------------------------------------------------------------

import { postForAnalysis, toDetectionResult } from './aiClient';
import type { DetectionResult } from '@/types';

export async function analyzeCameraFrame(frameBlob: Blob): Promise<DetectionResult> {
  const formData = new FormData();
  formData.append('frame', frameBlob, 'frame.jpg');
  const data = await postForAnalysis('/analyze-camera-frame', formData);
  return toDetectionResult('camera', data);
}
