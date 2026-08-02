// ---------------------------------------------------------------------------
// Threat engine — the only place in the backend that turns raw AI output
// (from the Flask service) into a risk level, recommendation, and the
// exact response shape the frontend expects. No inference happens here —
// only deterministic business rules applied to real detections.
// ---------------------------------------------------------------------------

const RISK = {
  SAFE: 'SAFE',
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

// The frontend already ships with RiskLevel = 'low' | 'moderate' | 'high' |
// 'critical' (see src/types/index.ts) and badge styling keyed on those four
// values. Mapping onto that existing vocabulary here means the frontend
// needs zero changes.
const FRONTEND_RISK_MAP = {
  [RISK.SAFE]: 'low',
  [RISK.LOW]: 'low',
  [RISK.MEDIUM]: 'moderate',
  [RISK.HIGH]: 'high',
  [RISK.CRITICAL]: 'critical',
};

const DANGER_KEYWORDS = [
  'help',
  'save me',
  'knife',
  'gun',
  'stop',
  "don't touch me",
  'leave me',
  'murder',
  'attack',
  'danger',
  'please help',
];

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

// ---------------------------------------------------------------------------
// Visual threat scoring (image upload + camera frame)
// ---------------------------------------------------------------------------

/**
 * Threat rules, exactly as specified:
 *   Weapon + person nearby  -> HIGH
 *   Only person             -> LOW
 *   No person, no weapon    -> SAFE
 *   Weapon only              -> MEDIUM
 *   Multiple weapons         -> CRITICAL
 */
function scoreVisualThreat({ weapons, persons }) {
  const weaponCount = weapons.length;
  const personCount = persons.count;

  if (weaponCount >= 2) return RISK.CRITICAL;
  if (weaponCount === 1 && personCount > 0) return RISK.HIGH;
  if (weaponCount === 1 && personCount === 0) return RISK.MEDIUM;
  if (weaponCount === 0 && personCount > 0) return RISK.LOW;
  return RISK.SAFE;
}

function primaryWeapon(weapons) {
  if (!weapons.length) return null;
  return [...weapons].sort((a, b) => b.confidence - a.confidence)[0];
}

function buildVisualLabel({ weapons, persons }) {
  const top = primaryWeapon(weapons);
  if (top) return capitalize(top.label);
  if (persons.count > 0) return 'Person';
  return 'Safe';
}

function buildVisualConfidence({ weapons, persons }) {
  const top = primaryWeapon(weapons);
  if (top) return Math.round(top.confidence);
  if (persons.count > 0) {
    const avg = persons.confidences.reduce((a, b) => a + b, 0) / persons.confidences.length;
    return Math.round(avg);
  }
  return 97;
}

function buildVisualReasoning({ weapons, persons }) {
  const weaponPart = weapons.length
    ? weapons.map((w) => `1 ${w.label} (${w.confidence}%)`).join(', ')
    : null;

  if (weaponPart && persons.count > 0) {
    return `YOLO detected ${weaponPart} and ${persons.count} nearby person(s).`;
  }
  if (weaponPart) {
    return `YOLO detected ${weaponPart} with no people nearby.`;
  }
  if (persons.count > 0) {
    return `YOLO detected ${persons.count} person(s) and no weapons.`;
  }
  return 'YOLO detected no weapons or people in this frame.';
}

function buildVisualRecommendation(risk, { weapons, persons }) {
  const top = primaryWeapon(weapons);
  const personWord = persons.count === 1 ? 'person' : 'people';

  switch (risk) {
    case RISK.CRITICAL:
      return `Multiple weapons detected (${weapons.length}). Immediate emergency response required.`;
    case RISK.HIGH:
      return `${capitalize(top.label)} detected near ${persons.count} ${personWord}. Immediate attention recommended.`;
    case RISK.MEDIUM:
      return `${capitalize(top.label)} detected. No people nearby, but stay alert.`;
    case RISK.LOW:
      return `${persons.count} ${personWord} detected. No immediate threat.`;
    default:
      return 'No threats detected. Continue routine monitoring.';
  }
}

/**
 * Takes Flask's raw `{ weapons, persons }` detection and returns exactly
 * the shape the frontend's DetectionResult mapping expects, plus a couple
 * of extra fields (sendAlert, rawRiskLevel) the frontend simply ignores.
 */
export function buildVisualResult(rawDetection) {
  const weapons = rawDetection?.weapons ?? [];
  const persons = rawDetection?.persons ?? { count: 0, confidences: [] };
  const normalized = { weapons, persons };

  const risk = scoreVisualThreat(normalized);
  const recommendation = buildVisualRecommendation(risk, normalized);

  return {
    label: buildVisualLabel(normalized),
    confidence: buildVisualConfidence(normalized),
    riskLevel: FRONTEND_RISK_MAP[risk],
    recommendation,
    reasoning: buildVisualReasoning(normalized),
    timestamp: new Date().toISOString(),
    // Structured alert data for the frontend's existing EmailJS wiring —
    // this backend never sends email itself, it just tells the frontend
    // whether it should, and what to say.
    sendAlert: risk === RISK.HIGH || risk === RISK.CRITICAL,
    rawRiskLevel: risk,
    message: recommendation,
    location: null,
    weaponsDetected: weapons,
    personsDetected: persons.count,
  };
}

// ---------------------------------------------------------------------------
// Audio threat scoring
// ---------------------------------------------------------------------------

function findDangerKeywords(transcript) {
  const lower = transcript.toLowerCase();
  return DANGER_KEYWORDS.filter((keyword) => lower.includes(keyword));
}

/**
 * Takes a real Whisper transcript and returns the same response shape,
 * with the transcript and matched keywords attached. Dangerous speech is
 * always scored HIGH per the specified rules.
 */
export function buildAudioResult(transcript) {
  const safeTranscript = transcript ?? '';
  const keywords = safeTranscript ? findDangerKeywords(safeTranscript) : [];
  const risk = keywords.length > 0 ? RISK.HIGH : RISK.SAFE;
  const recommendation = keywords.length
    ? 'Emergency response recommended.'
    : 'No dangerous keywords detected.';

  return {
    label: keywords.length ? capitalize(keywords[0]) : 'Safe',
    confidence: keywords.length ? 90 : 92,
    riskLevel: FRONTEND_RISK_MAP[risk],
    recommendation,
    reasoning: keywords.length
      ? `Whisper transcribed the audio and detected keyword(s): ${keywords.join(', ')}.`
      : safeTranscript
        ? 'Whisper transcribed the audio; no danger keywords were found.'
        : 'Whisper detected no speech in this segment.',
    timestamp: new Date().toISOString(),
    transcript: safeTranscript,
    keywords,
    sendAlert: risk === RISK.HIGH,
    rawRiskLevel: risk,
    message: recommendation,
    location: 'Frontend GPS',
  };
}
