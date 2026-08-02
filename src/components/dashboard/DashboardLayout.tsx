import { NavLink, Outlet, Link } from 'react-router-dom';
import { FiShield, FiCamera, FiImage, FiMic, FiMap, FiClock, FiBarChart2, FiHome } from 'react-icons/fi';
import NotificationBell from '@/components/alerts/NotificationBell';
import clsx from '@/utils/clsx';

const tabs = [
  { to: '/dashboard', label: 'Overview', icon: FiBarChart2, end: true },
  { to: '/dashboard/camera', label: 'Camera', icon: FiCamera },
  { to: '/dashboard/image', label: 'Image Upload', icon: FiImage },
  { to: '/dashboard/audio', label: 'Audio', icon: FiMic },
  { to: '/dashboard/map', label: 'Live Map', icon: FiMap },
  { to: '/dashboard/history', label: 'Alert History', icon: FiClock },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-base-900">
      <header className="sticky top-0 z-40 border-b border-white/5 bg-base-900/90 backdrop-blur-lg">
        <div className="container-px mx-auto flex h-16 max-w-[1600px] items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-white">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal/15 text-signal-soft">
              <FiShield />
            </span>
            SafeStreet <span className="text-signal-soft">AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden items-center gap-1.5 text-sm text-slate-400 hover:text-white sm:flex">
              <FiHome size={14} /> Landing page
            </Link>
            <NotificationBell />
          </div>
        </div>
      </header>

      <div className="container-px mx-auto max-w-[1600px] py-6">
        <nav className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02] p-2">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) =>
                clsx(
                  'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-signal text-white shadow-glow' : 'text-slate-400 hover:text-white hover:bg-white/5',
                )
              }
            >
              <tab.icon size={15} />
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <Outlet />
      </div>
    </div>
  );
}
