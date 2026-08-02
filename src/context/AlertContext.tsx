import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { sendEmergencyEmail } from '@/services/emailService';
import { resolveAlertLocation } from '@/services/mapService';
import { buildAnalyticsSnapshot } from '@/services/analyticsService';
import { generateId } from '@/utils/helpers';
import type { AlertStatus, AnalyticsSnapshot, DetectionResult, EmergencyAlert } from '@/types';

interface AlertContextValue {
  alerts: EmergencyAlert[];
  activeAlert: EmergencyAlert | null;
  dismissActiveAlert: () => void;
  analytics: AnalyticsSnapshot;
  raiseAlert: (detection: DetectionResult) => Promise<EmergencyAlert>;
  updateAlertStatus: (id: string, status: AlertStatus) => void;
  unreadCount: number;
  markAllRead: () => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(null);
  const [emailsSent, setEmailsSent] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  // Called only after a real AI detection (image/camera/audio) has already
  // come back from the backend with a high/critical risk level. This never
  // originates an alert on its own.
  const raiseAlert = useCallback(async (detection: DetectionResult) => {
    const coords = await resolveAlertLocation();

    const alert: EmergencyAlert = {
      id: generateId('alert'),
      source: detection.source,
      threatType: detection.label,
      confidence: detection.confidence,
      riskLevel: detection.riskLevel,
      timestamp: detection.timestamp,
      latitude: coords.latitude,
      longitude: coords.longitude,
      status: 'new',
      emailSent: false,
      suggestedAction: detection.recommendation ?? 'Notify the nearest response team.',
    };

    setAlerts((prev) => [alert, ...prev].slice(0, 200));
    setActiveAlert(alert);
    setUnreadCount((c) => c + 1);

    const result = await sendEmergencyEmail(alert);
    if (result.ok) {
      setEmailsSent((c) => c + 1);
      setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, emailSent: true } : a)));
    }

    return alert;
  }, []);

  const updateAlertStatus = useCallback((id: string, status: AlertStatus) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const dismissActiveAlert = useCallback(() => setActiveAlert(null), []);
  const markAllRead = useCallback(() => setUnreadCount(0), []);

  const analytics: AnalyticsSnapshot = useMemo(
    () => buildAnalyticsSnapshot(alerts, emailsSent),
    [alerts, emailsSent],
  );

  const value: AlertContextValue = {
    alerts,
    activeAlert,
    dismissActiveAlert,
    analytics,
    raiseAlert,
    updateAlertStatus,
    unreadCount,
    markAllRead,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
}

export function useAlerts() {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error('useAlerts must be used within an AlertProvider');
  return ctx;
}
