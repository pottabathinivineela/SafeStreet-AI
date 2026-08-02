import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiActivity } from 'react-icons/fi';
import Button from '@/components/ui/Button';

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Signature element: a vertical scan-line sweeping over a grid, like a
          sensor continuously reading the street. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid-fade [background-size:28px_28px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden">
        <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-signal/25 to-transparent blur-2xl animate-scan" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5"
            >
              <FiActivity className="text-safe" />
              Live prototype — AI street safety network
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl"
            >
              Transforming street lights into{' '}
              <span className="bg-gradient-to-r from-signal-soft to-safe bg-clip-text text-transparent">
                intelligent safety networks
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-lg text-lg text-slate-400"
            >
              SafeStreet AI listens, watches, and responds — turning ordinary street
              infrastructure into a sensor network that flags danger the moment it happens
              and puts responders on the way in seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <Link to="/dashboard">
                <Button icon={<FiArrowRight />} className="flex-row-reverse">
                  Launch Live Demo
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="ghost">See how it works</Button>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="glass-card overflow-hidden p-0 shadow-glow">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                <span className="font-mono text-xs text-slate-400">POLE-CAM // SECTOR 07</span>
                <span className="flex items-center gap-1.5 text-xs text-safe">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-safe" /> LIVE
                </span>
              </div>
              <div className="relative aspect-[4/3] bg-base-950">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(37,99,235,0.18),transparent_60%)]" />
                <div className="absolute left-[18%] top-[30%] h-[42%] w-[26%] rounded-md border-2 border-signal-soft/80">
                  <span className="absolute -top-6 left-0 rounded bg-signal-soft/90 px-2 py-0.5 font-mono text-[10px] text-base-950">
                    PERSON 98%
                  </span>
                </div>
                <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.15)_1px,transparent_1px)] [background-size:24px_24px]" />
              </div>
              <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 text-center">
                <div className="p-3">
                  <div className="font-display text-lg text-white">2.4s</div>
                  <div className="text-[11px] text-slate-500">avg. response</div>
                </div>
                <div className="p-3">
                  <div className="font-display text-lg text-white">98%</div>
                  <div className="text-[11px] text-slate-500">detection accuracy*</div>
                </div>
                <div className="p-3">
                  <div className="font-display text-lg text-white">24/7</div>
                  <div className="text-[11px] text-slate-500">monitoring</div>
                </div>
              </div>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-600">*Simulated prototype metrics for demonstration.</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
