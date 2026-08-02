import Section from './Section';
import { motion } from 'framer-motion';
import { FiEye, FiZap, FiSend } from 'react-icons/fi';

const steps = [
  { icon: FiEye, title: 'Sense', body: 'Camera, image, and audio inputs are continuously analyzed for signs of danger.' },
  { icon: FiZap, title: 'Decide', body: 'A risk score and threat classification are produced in real time, on every input stream.' },
  { icon: FiSend, title: 'Respond', body: 'High-risk events instantly trigger a mapped, timestamped alert and an emergency email.' },
];

export default function Solution() {
  return (
    <Section
      id="solution"
      eyebrow="The solution"
      title="Sense, decide, respond — without waiting on a human to be watching"
      description="SafeStreet AI closes the loop between detection and dispatch, so the moment something looks wrong, the right people already know."
    >
      <div className="relative grid gap-8 md:grid-cols-3">
        <div className="absolute left-0 right-0 top-8 hidden h-px bg-white/10 md:block" />
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative text-center"
          >
            <div className="relative z-10 mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-signal/30 bg-base-900 text-2xl text-signal-soft shadow-glow">
              <s.icon />
            </div>
            <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
