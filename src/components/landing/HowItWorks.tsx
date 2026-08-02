import Section from './Section';
import { motion } from 'framer-motion';

const steps = [
  { title: 'Capture', body: 'A street-level sensor (camera or mic) picks up a live feed.' },
  { title: 'Analyze', body: 'The detection engine scores the feed for risk every few seconds.' },
  { title: 'Classify', body: 'A threat type and confidence score are assigned to any anomaly.' },
  { title: 'Alert', body: 'High-risk events raise a popup, a map marker, and an emergency email.' },
  { title: 'Track', body: 'Responders update the alert status as it moves toward resolution.' },
];

export default function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      eyebrow="Process"
      title="From first frame to first responder"
      description="A typed sequence, because the order matters — each step depends on the one before it."
    >
      <div className="grid gap-6 md:grid-cols-5">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5"
          >
            <span className="font-mono text-xs text-signal-soft">0{i + 1}</span>
            <h3 className="mt-2 font-semibold text-white">{s.title}</h3>
            <p className="mt-1.5 text-sm text-slate-400">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
