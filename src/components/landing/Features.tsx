import Section from './Section';
import GlassCard from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import {
  FiCamera,
  FiImage,
  FiMic,
  FiMap,
  FiBell,
  FiClock,
  FiBarChart2,
  FiMessageCircle,
} from 'react-icons/fi';

const features = [
  { icon: FiCamera, title: 'AI Camera Detection', body: 'Live webcam analysis flags fights, weapons, and panic in real time with bounding-box overlays.' },
  { icon: FiImage, title: 'Image Upload Analysis', body: 'Upload a photo and get an instant threat classification with a confidence and risk score.' },
  { icon: FiMic, title: 'Audio Detection', body: 'Listens for distress keywords like "help" or "fire" with a live waveform and instant flag.' },
  { icon: FiMap, title: 'Live Threat Map', body: 'Every detected incident is plotted on a live map with location, time, and risk level.' },
  { icon: FiBell, title: 'Emergency Alerts', body: 'Dangerous events automatically raise a popup, a bell notification, and an emergency email.' },
  { icon: FiClock, title: 'Alert History', body: 'Every event is logged and searchable — filter and sort by time, type, or status.' },
  { icon: FiBarChart2, title: 'Live Analytics', body: 'Dashboard cards and charts track threats, alerts, and system health as they happen.' },
  { icon: FiMessageCircle, title: 'AI Assistant', body: 'A floating chatbot explains how the system works, from detection to dispatch.' },
];

export default function Features() {
  return (
    <Section
      id="features"
      eyebrow="Capabilities"
      title="Eight systems, one response loop"
      description="Every module below is fully interactive in the live demo — open the dashboard to try each one."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
          >
            <GlassCard glow="signal" className="h-full">
              <f.icon className="mb-4 text-2xl text-signal-soft" />
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{f.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
