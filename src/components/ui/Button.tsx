import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from '@/utils/clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger' | 'safe';
  icon?: ReactNode;
}

const variants: Record<string, string> = {
  primary: 'bg-signal hover:bg-signal-soft text-white shadow-glow',
  ghost: 'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10',
  danger: 'bg-danger hover:bg-danger-soft text-white shadow-glow-danger',
  safe: 'bg-safe hover:bg-safe-soft text-base-900 font-semibold',
};

export default function Button({ children, variant = 'primary', icon, className, ...rest }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
        variants[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
