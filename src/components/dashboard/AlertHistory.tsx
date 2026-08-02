import { useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useAlerts } from '@/context/AlertContext';
import { formatDateTime } from '@/utils/helpers';
import { RiskBadge } from '@/components/ui/Badge';
import GlassCard from '@/components/ui/GlassCard';
import type { AlertStatus } from '@/types';

type SortKey = 'time' | 'confidence';

const STATUS_STYLE: Record<AlertStatus, string> = {
  new: 'text-danger',
  acknowledged: 'text-amber-400',
  resolved: 'text-safe',
};

export default function AlertHistory() {
  const { alerts, updateAlertStatus } = useAlerts();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [sortKey, setSortKey] = useState<SortKey>('time');

  const filtered = useMemo(() => {
    let list = alerts.filter((a) => a.threatType.toLowerCase().includes(query.toLowerCase()));
    if (statusFilter !== 'all') list = list.filter((a) => a.status === statusFilter);
    return [...list].sort((a, b) =>
      sortKey === 'time'
        ? new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        : b.confidence - a.confidence,
    );
  }, [alerts, query, statusFilter, sortKey]);

  return (
    <GlassCard className="p-0">
      <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-semibold text-white">Alert History</h2>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search threat type..."
              className="rounded-xl border border-white/10 bg-base-900/60 py-2 pl-8 pr-3 text-sm text-white outline-none focus:border-signal"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AlertStatus | 'all')}
            className="rounded-xl border border-white/10 bg-base-900/60 px-3 py-2 text-sm text-white outline-none focus:border-signal"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="acknowledged">Acknowledged</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="rounded-xl border border-white/10 bg-base-900/60 px-3 py-2 text-sm text-white outline-none focus:border-signal"
          >
            <option value="time">Sort: Newest first</option>
            <option value="confidence">Sort: Confidence</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Threat</th>
              <th className="px-5 py-3 font-medium">Confidence</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Location</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-slate-500">
                  No alerts recorded yet. Trigger a detection from Camera, Image, or Audio.
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} className="hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-slate-400">{formatDateTime(a.timestamp)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{a.threatType}</span>
                      <RiskBadge risk={a.riskLevel} />
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-300">{a.confidence}%</td>
                  <td className="px-5 py-3 text-slate-400 capitalize">{a.source}</td>
                  <td className="px-5 py-3 font-mono text-xs text-slate-400">
                    {a.latitude.toFixed(3)}, {a.longitude.toFixed(3)}
                  </td>
                  <td className="px-5 py-3">
                    <select
                      value={a.status}
                      onChange={(e) => updateAlertStatus(a.id, e.target.value as AlertStatus)}
                      className={`rounded-lg border border-white/10 bg-base-900/60 px-2 py-1 text-xs font-medium outline-none ${STATUS_STYLE[a.status]}`}
                    >
                      <option value="new">New</option>
                      <option value="acknowledged">Acknowledged</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
