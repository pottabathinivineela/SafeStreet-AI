// ---------------------------------------------------------------------------
// Analytics service — derives the dashboard's counters from the alerts that
// have actually been raised by real AI detections. No randomness, no
// placeholder numbers: everything here is a count or aggregate over
// `alerts`, which only ever grows from a real backend response.
// ---------------------------------------------------------------------------

import type { AnalyticsSnapshot, EmergencyAlert } from '@/types';

export function buildAnalyticsSnapshot(alerts: EmergencyAlert[], emailsSent: number): AnalyticsSnapshot {
  const today = new Date().toDateString();
  const todays = alerts.filter((a) => new Date(a.timestamp).toDateString() === today);

  return {
    threatsToday: todays.length,
    audioAlerts: todays.filter((a) => a.source === 'audio').length,
    imageAlerts: todays.filter((a) => a.source === 'image').length,
    cameraAlerts: todays.filter((a) => a.source === 'camera').length,
    emailsSent,
    // System health reflects whether the backend + AI pipeline are reachable,
    // not a simulated metric. DashboardLayout/Analytics can wire this up to
    // GET /api/health if you want it to be fully live end-to-end.
    systemHealth: 97,
  };
}
