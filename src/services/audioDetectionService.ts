// ---------------------------------------------------------------------------
// Audio detection service — sends a recorded microphone segment to the
// real backend speech endpoint (POST /analyze-audio), which transcribes it
// with Whisper and scans the transcript for danger keywords server-side.
// ---------------------------------------------------------------------------

import { postForAnalysis, toDetectionResult } from './aiClient';
import type { DetectionResult } from '@/types';

export async function analyzeAudioSegment(audioBlob: Blob): Promise<DetectionResult> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'segment.webm');
  const data = await postForAnalysis('/analyze-audio', formData);
  return toDetectionResult('audio', data);
}
