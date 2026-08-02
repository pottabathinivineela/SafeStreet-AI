import { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { useAlerts } from '@/context/AlertContext';
import { formatTime } from '@/utils/helpers';
import { RiskBadge } from '@/components/ui/Badge';

export default function NotificationBell() {
  const { alerts, unreadCount, markAllRead } = useAlerts();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen((o) => !o);
          if (!open) markAllRead();
        }}
        className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:text-white"
        aria-label="Notifications"
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-40 max-h-96 w-80 overflow-y-auto rounded-2xl border border-white/10 bg-base-800 shadow-glow">
          <div className="border-b border-white/10 px-4 py-3 text-sm font-semibold text-white">Notifications</div>
          {alerts.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-500">No alerts yet.</p>
          ) : (
            <ul className="divide-y divide-white/5">
              {alerts.slice(0, 12).map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{a.threatType}</span>
                    <RiskBadge risk={a.riskLevel} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {a.source} · {formatTime(a.timestamp)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
