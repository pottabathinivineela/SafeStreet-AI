import { FiAlertTriangle, FiMic, FiImage, FiCamera, FiMail, FiActivity } from 'react-icons/fi';
import { useAlerts } from '@/context/AlertContext';
import GlassCard from '@/components/ui/GlassCard';
import { SourcePieChart, RiskBarChart, TrendLineChart } from '@/components/analytics/Charts';
import MapView from '@/components/maps/MapView';

export default function Analytics() {
  const { analytics, alerts } = useAlerts();

  const cards = [
    { label: 'Threats Today', value: analytics.threatsToday, icon: FiAlertTriangle, tone: 'text-danger' },
    { label: 'Camera Alerts', value: analytics.cameraAlerts, icon: FiCamera, tone: 'text-signal-soft' },
    { label: 'Image Alerts', value: analytics.imageAlerts, icon: FiImage, tone: 'text-signal-soft' },
    { label: 'Audio Alerts', value: analytics.audioAlerts, icon: FiMic, tone: 'text-signal-soft' },
    { label: 'Emails Sent', value: analytics.emailsSent, icon: FiMail, tone: 'text-safe' },
    { label: 'System Health', value: `${analytics.systemHealth}%`, icon: FiActivity, tone: 'text-safe' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <GlassCard key={c.label} className="p-4">
            <c.icon className={`mb-2 text-xl ${c.tone}`} />
            <div className="font-display text-2xl font-semibold text-white">{c.value}</div>
            <div className="mt-1 text-xs text-slate-500">{c.label}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold text-white">Alerts by Source</h3>
          <SourcePieChart alerts={alerts} />
        </GlassCard>
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold text-white">Alerts by Risk Level</h3>
          <RiskBarChart alerts={alerts} />
        </GlassCard>
        <GlassCard>
          <h3 className="mb-2 text-sm font-semibold text-white">7-Day Trend</h3>
          <TrendLineChart alerts={alerts} />
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="mb-4 text-sm font-semibold text-white">Live Threat Map</h3>
        <MapView alerts={alerts} />
      </GlassCard>
    </div>
  );
}
