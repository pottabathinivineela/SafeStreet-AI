import type { HTMLAttributes, ReactNode } from 'react';
import clsx from '@/utils/clsx';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: 'none' | 'signal' | 'safe' | 'danger';
}

const glowMap: Record<string, string> = {
  none: '',
  signal: 'hover:shadow-glow',
  safe: 'hover:shadow-glow-safe',
  danger: 'shadow-glow-danger',
};

export default function GlassCard({ children, glow = 'none', className, ...rest }: GlassCardProps) {
  return (
    <div className={clsx('glass-card p-6 transition-shadow duration-300', glowMap[glow], className)} {...rest}>
      {children}
    </div>
  );
}
