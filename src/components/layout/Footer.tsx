import { FiShield, FiGithub, FiMail, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-base-950">
      <div className="container-px mx-auto max-w-7xl py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display text-lg font-semibold text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-signal/15 text-signal-soft">
                <FiShield />
              </span>
              SafeStreet AI
            </div>
            <p className="mt-3 max-w-sm text-sm text-slate-400">
              Transforming street lights into intelligent safety networks — detecting danger
              and alerting responders before it escalates.
            </p>
            <div className="mt-5 flex gap-3 text-slate-400">
              <a href="#" aria-label="GitHub" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 hover:text-white hover:border-white/20">
                <FiGithub />
              </a>
              <a href="#" aria-label="LinkedIn" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 hover:text-white hover:border-white/20">
                <FiLinkedin />
              </a>
              <a href="#contact" aria-label="Email" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 hover:text-white hover:border-white/20">
                <FiMail />
              </a>
            </div>
          </div>

          <div>
            <h4 className="eyebrow">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-white">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How it Works</a></li>
              <li><a href="#technology" className="hover:text-white">Technology</a></li>
              <li><a href="#live-demo" className="hover:text-white">Live Demo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow">Company</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li><a href="#about" className="hover:text-white">About</a></li>
              <li><a href="#impact" className="hover:text-white">Impact</a></li>
              <li><a href="#contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} SafeStreet AI. Prototype build — not for production deployment.</span>
          <span>Built with React · TypeScript · Tailwind</span>
        </div>
      </div>
    </footer>
  );
}
