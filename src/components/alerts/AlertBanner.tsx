import { AnimatePresence, motion } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';
import { useAlerts } from '@/context/AlertContext';
import { formatTime } from '@/utils/helpers';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';

/** Full-screen red alert popup shown when a dangerous event is detected. */
export default function AlertBanner() {
  const { activeAlert, dismissActiveAlert } = useAlerts();

  return (
    <AnimatePresence>
      {activeAlert && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-2xl border border-danger/50 bg-base-900 shadow-glow-danger"
          >
            <div className="animate-flashBanner flex items-center gap-3 rounded-t-2xl border-b border-danger/30 px-5 py-4">
              <FiAlertTriangle className="text-2xl text-danger" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-danger">Emergency Alert</p>
                <p className="text-xs text-slate-300">Detected via {activeAlert.source}</p>
              </div>
              <button onClick={dismissActiveAlert} className="ml-auto text-slate-400 hover:text-white" aria-label="Dismiss">
                <FiX />
              </button>
            </div>

            <div className="space-y-2.5 px-5 py-5 text-sm">
              <Row label="Threat type" value={activeAlert.threatType} />
              <Row label="Confidence" value={`${activeAlert.confidence}%`} />
              <Row label="Risk level" value={activeAlert.riskLevel.toUpperCase()} />
              <Row label="Time" value={formatTime(activeAlert.timestamp)} />
              <Row label="Location" value={`${activeAlert.latitude.toFixed(4)}, ${activeAlert.longitude.toFixed(4)}`} />
              <Row label="Suggested action" value={activeAlert.suggestedAction} />
              <Row label="Email alert" value={activeAlert.emailSent ? 'Sent' : 'Sending…'} />
            </div>

            <div className="flex gap-3 border-t border-white/10 px-5 py-4">
              <Button variant="danger" className="flex-1" onClick={dismissActiveAlert}>
                Acknowledge
              </Button>
              <Link to="/dashboard/history" className="flex-1" onClick={dismissActiveAlert}>
                <Button variant="ghost" className="w-full">View history</Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
