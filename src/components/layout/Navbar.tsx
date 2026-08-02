import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiShield } from 'react-icons/fi';
import { NAV_LINKS } from '@/utils/constants';
import Button from '@/components/ui/Button';
import clsx from '@/utils/clsx';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const goToSection = (href: string) => {
    setOpen(false);
    if (location.pathname !== '/') {
      navigate('/' + href);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'bg-base-900/85 backdrop-blur-lg border-b border-white/5' : 'bg-transparent',
      )}
    >
      <nav className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal/15 text-signal-soft">
            <FiShield />
          </span>
          SafeStreet <span className="text-signal-soft">AI</span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={() => goToSection(link.href)}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:block">
          <Link to="/dashboard">
            <Button>Open Dashboard</Button>
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-white lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-base-900/95 backdrop-blur-lg lg:hidden">
          <div className="container-px mx-auto flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => goToSection(link.href)}
                className="rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </button>
            ))}
            <Link to="/dashboard" className="mt-2" onClick={() => setOpen(false)}>
              <Button className="w-full">Open Dashboard</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
