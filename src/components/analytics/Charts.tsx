import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import type { EmergencyAlert } from '@/types';

const COLORS = ['#2563EB', '#22C55E', '#F97316', '#EF4444'];

function bySource(alerts: EmergencyAlert[]) {
  const counts: Record<string, number> = { camera: 0, image: 0, audio: 0 };
  alerts.forEach((a) => { counts[a.source] = (counts[a.source] ?? 0) + 1; });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function byRisk(alerts: EmergencyAlert[]) {
  const counts: Record<string, number> = { low: 0, moderate: 0, high: 0, critical: 0 };
  alerts.forEach((a) => { counts[a.riskLevel] = (counts[a.riskLevel] ?? 0) + 1; });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

function last7DaysTrend(alerts: EmergencyAlert[]) {
  const days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString([], { weekday: 'short' });
    const count = alerts.filter((a) => new Date(a.timestamp).toDateString() === d.toDateString()).length;
    days.push({ date: label, count });
  }
  return days;
}

export function SourcePieChart({ alerts }: { alerts: EmergencyAlert[] }) {
  const data = bySource(alerts);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RiskBarChart({ alerts }: { alerts: EmergencyAlert[] }) {
  const data = byRisk(alerts);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
        <YAxis stroke="#64748B" fontSize={12} allowDecimals={false} />
        <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563EB" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({ alerts }: { alerts: EmergencyAlert[] }) {
  const data = last7DaysTrend(alerts);
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
        <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
        <YAxis stroke="#64748B" fontSize={12} allowDecimals={false} />
        <Tooltip contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
        <Line type="monotone" dataKey="count" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
