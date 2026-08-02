// Central type definitions for SafeStreet AI.
// These shapes are dictated by what the real backend in /backend actually
// returns (see backend/src/routes/analyze.js) — nothing here is generated
// client-side anymore.

export type ThreatSource = 'camera' | 'image' | 'audio';

export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

/** Labels the vision model (backend /analyze-image, /analyze-camera-frame) can return. */
export type VisualThreatLabel =
  | 'Safe'
  | 'Normal Crowd'
  | 'Fight'
  | 'Weapon'
  | 'Person Running'
  | 'Crowd Panic'
  | 'Person Lying'
  | 'Suspicious Behavior'
  | 'Fire'
  | 'Accident'
  | 'Suspicious Gathering';

/** Danger keywords the backend looks for in a Whisper transcript. */
export type AudioKeyword =
  | 'Help'
  | 'Save me'
  | 'Stop'
  | "Don't touch me"
  | 'Fire'
  | 'Gun'
  | 'Attack'
  | 'Murder'
  | 'Emergency'
  | 'Scream'
  | 'Kidnap';

export interface DetectionResult {
  id: string;
  source: ThreatSource;
  label: VisualThreatLabel | AudioKeyword | string;
  confidence: number; // 0-100, as returned by the AI model
  riskLevel: RiskLevel;
  timestamp: string; // ISO string, set client-side when the response arrives
  recommendation?: string;
  /** Present on audio detections — the real Whisper transcript. */
  transcript?: string;
  /** Present on vision detections — the model's one-line justification. */
  reasoning?: string;
}

export type AlertStatus = 'new' | 'acknowledged' | 'resolved';

export interface EmergencyAlert {
  id: string;
  source: ThreatSource;
  threatType: string;
  confidence: number;
  riskLevel: RiskLevel;
  timestamp: string;
  latitude: number;
  longitude: number;
  status: AlertStatus;
  emailSent: boolean;
  suggestedAction: string;
}

export interface AnalyticsSnapshot {
  threatsToday: number;
  audioAlerts: number;
  imageAlerts: number;
  cameraAlerts: number;
  emailsSent: number;
  systemHealth: number; // percentage
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
}
