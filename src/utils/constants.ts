import type { RiskLevel } from '@/types';

// Base URL of the SafeStreet AI backend (see /backend). Configure via
// VITE_API_BASE_URL in .env — defaults to the local Express dev server.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Shown in the Audio Detection UI as a hint of what the backend listens
// for. Purely informational — the actual matching happens server-side
// against the real Whisper transcript in backend/src/utils/riskEngine.js.
export const AUDIO_KEYWORD_HINTS = [
  'Help', 'Save me', 'Stop', "Don't touch me", 'Fire',
  'Gun', 'Attack', 'Murder', 'Emergency', 'Kidnap',
];

// Used only for frontend badge styling — the risk level itself always
// comes from the backend response, never computed client-side.
export const RISK_COLOR: Record<RiskLevel, string> = {
  low: 'text-safe border-safe/40 bg-safe/10',
  moderate: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
  high: 'text-orange-400 border-orange-400/40 bg-orange-400/10',
  critical: 'text-danger border-danger/40 bg-danger/10',
};

// Default map center — Hyderabad, India. Replace with your deployment city.
export const DEFAULT_MAP_CENTER: [number, number] = [17.385, 78.4867];

export const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Problem', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'Features', href: '#features' },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Technology', href: '#technology' },
  { label: 'Live Demo', href: '#live-demo' },
  { label: 'Impact', href: '#impact' },
  { label: 'Contact', href: '#contact' },
];
