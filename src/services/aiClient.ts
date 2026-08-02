// ---------------------------------------------------------------------------
// Shared client for talking to the SafeStreet AI backend (see /backend).
// Every detection service uses this so error handling stays consistent:
// on failure, callers get a thrown Error — never a fabricated result.
// ---------------------------------------------------------------------------

import { API_BASE_URL } from '@/utils/constants';
import { generateId } from '@/utils/helpers';
import type { DetectionResult, RiskLevel, ThreatSource } from '@/types';

export interface BackendDetectionResponse {
  label: string;
  confidence: number;
  riskLevel: RiskLevel;
  recommendation?: string;
  transcript?: string;
  reasoning?: string;
}

export class AnalysisError extends Error {}

export async function postForAnalysis(path: string, formData: FormData): Promise<BackendDetectionResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { method: 'POST', body: formData });
  } catch {
    throw new AnalysisError('Could not reach the SafeStreet AI backend. Is it running?');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new AnalysisError(body.error || `Analysis request failed (${response.status}).`);
  }

  return response.json();
}

/** Converts a raw backend response into the app-wide DetectionResult shape. */
export function toDetectionResult(source: ThreatSource, data: BackendDetectionResponse): DetectionResult {
  return {
    id: generateId(source),
    source,
    label: data.label,
    confidence: data.confidence,
    riskLevel: data.riskLevel,
    timestamp: new Date().toISOString(),
    recommendation: data.recommendation,
    transcript: data.transcript,
    reasoning: data.reasoning,
  };
}

/** True once a detection result should raise an emergency alert. */
export function isDangerDetection(result: DetectionResult): boolean {
  return result.riskLevel === 'high' || result.riskLevel === 'critical';
}
