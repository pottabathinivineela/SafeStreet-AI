// ---------------------------------------------------------------------------
// EmailJS integration — SafeStreet AI Emergency Alert emails
// ---------------------------------------------------------------------------
// 1. Create a free account at https://www.emailjs.com/
// 2. Create an Email Service (e.g. Gmail) -> copy its Service ID.
// 3. Create an Email Template with the variables listed below -> copy its
//    Template ID.
// 4. Copy your Public Key from Account > General.
// 5. Put all three into a .env file at the project root (copy .env.example):
//
//      VITE_EMAILJS_SERVICE_ID=your_service_id_here
//      VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
//      VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
//
// The EmailJS template should reference these variables:
//   {{threat_type}} {{confidence}} {{location}} {{time}}
//   {{latitude}} {{longitude}} {{suggested_action}} {{risk_level}}
//
// Suggested template subject:
//   🚨 SafeStreet AI Emergency Alert
// ---------------------------------------------------------------------------

import emailjs from '@emailjs/browser';
import type { EmergencyAlert } from '@/types';

// TODO: These read from environment variables. If you'd rather hardcode
// them for a quick local demo, you can replace the right-hand side of each
// line below with a plain string — but env vars are recommended so keys
// never get committed to source control.
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? 'SERVICE_ID';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? 'TEMPLATE_ID';
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? 'PUBLIC_KEY';

const isConfigured = () =>
  SERVICE_ID !== 'SERVICE_ID' && TEMPLATE_ID !== 'TEMPLATE_ID' && PUBLIC_KEY !== 'PUBLIC_KEY';

export interface EmailResult {
  ok: boolean;
  simulated: boolean;
  message: string;
}

/**
 * Sends (or simulates sending) an emergency alert email via EmailJS.
 * Falls back to a simulated send when credentials haven't been configured
 * yet, so the rest of the app keeps working out of the box.
 */
export async function sendEmergencyEmail(alert: EmergencyAlert): Promise<EmailResult> {
  const templateParams = {
    subject: '🚨 SafeStreet AI Emergency Alert',
    threat_type: alert.threatType,
    threat_source: alert.source,
    confidence: `${alert.confidence}%`,
    location: `${alert.latitude.toFixed(5)}, ${alert.longitude.toFixed(5)}`,
    time: new Date(alert.timestamp).toLocaleString(),
    latitude: alert.latitude,
    longitude: alert.longitude,
    suggested_action: alert.suggestedAction,
    risk_level: alert.riskLevel.toUpperCase(),
  };

  if (!isConfigured()) {
    // No real credentials yet — simulate a successful send so the UI flow
    // (history, "Emails Sent" counter, notification bell) can still be
    // demoed end-to-end.
    console.info('[EmailJS] Simulated send (add credentials in .env to go live):', templateParams);
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { ok: true, simulated: true, message: 'Simulated email sent (EmailJS not configured).' };
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, { publicKey: PUBLIC_KEY });
    return { ok: true, simulated: false, message: 'Emergency email sent.' };
  } catch (error) {
    console.error('[EmailJS] Failed to send emergency email', error);
    return { ok: false, simulated: false, message: 'Failed to send emergency email.' };
  }
}
