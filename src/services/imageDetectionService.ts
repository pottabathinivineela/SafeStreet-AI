// ---------------------------------------------------------------------------
// Image detection service — sends an uploaded photo to the real backend
// vision endpoint (POST /analyze-image) and returns its actual prediction.
// No random label is ever produced here.
// ---------------------------------------------------------------------------

import { postForAnalysis, toDetectionResult } from './aiClient';
import type { DetectionResult } from '@/types';
import { getCurrentPosition } from './geoService';

export async function analyzeUploadedImage(file: File): Promise<DetectionResult> {
const position = await getCurrentPosition();

const formData = new FormData();

formData.append("latitude", position.latitude.toString());
formData.append("longitude", position.longitude.toString());

formData.append("image", file);

  
  const data = await postForAnalysis('/analyze-image', formData);
  return toDetectionResult('image', data);
}
