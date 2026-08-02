import type { Config } from 'tailwindcss';

// Tailwind theme derived from the SafeStreet AI design tokens.
// Palette is intentionally restrained: two neutrals, one signal blue,
// one "safe" green, one "danger" red.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0B1220',
          900: '#0F172A',
          800: '#1E293B',
          700: '#28374A',
        },
        signal: {
          DEFAULT: '#2563EB',
          soft: '#3B82F6',
        },
        safe: {
          DEFAULT: '#22C55E',
          soft: '#4ADE80',
        },
        danger: {
          DEFAULT: '#EF4444',
          soft: '#F87171',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(37,99,235,0.35), 0 0 24px -4px rgba(37,99,235,0.45)',
        'glow-danger': '0 0 0 1px rgba(239,68,68,0.45), 0 0 30px -2px rgba(239,68,68,0.55)',
        'glow-safe': '0 0 0 1px rgba(34,197,94,0.35), 0 0 24px -4px rgba(34,197,94,0.45)',
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(to bottom, rgba(15,23,42,0) 0%, rgba(15,23,42,1) 90%), radial-gradient(circle at 1px 1px, rgba(148,163,184,0.15) 1px, transparent 0)',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '80%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        flashBanner: {
          '0%, 100%': { backgroundColor: 'rgba(239,68,68,0.15)' },
          '50%': { backgroundColor: 'rgba(239,68,68,0.35)' },
        },
      },
      animation: {
        scan: 'scan 3.5s linear infinite',
        pulseRing: 'pulseRing 2s cubic-bezier(0,0,0.2,1) infinite',
        flashBanner: 'flashBanner 1.1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
