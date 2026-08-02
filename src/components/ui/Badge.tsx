import clsx from '@/utils/clsx';
import { RISK_COLOR } from '@/utils/constants';
import type { RiskLevel } from '@/types';

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <span className={clsx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-mono uppercase tracking-wide', RISK_COLOR[risk])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {risk}
    </span>
  );
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-mono text-slate-300', className)}>
      {children}
    </span>
  );
}
