import Section from './Section';
import GlassCard from '@/components/ui/GlassCard';
import { FiMapPin, FiCpu, FiUsers } from 'react-icons/fi';

const points = [
  { icon: FiMapPin, title: 'Built for real streets', body: 'Designed to sit on infrastructure that already exists — street light poles, junction boxes, and public cameras.' },
  { icon: FiCpu, title: 'AI at the edge', body: 'Detection logic is structured to run close to the sensor, so alerts fire in seconds, not minutes.' },
  { icon: FiUsers, title: 'For the people who respond', body: 'Every alert is built around what a dispatcher or patrol officer needs first: what, where, and how urgent.' },
];

export default function About() {
  return (
    <Section
      id="about"
      eyebrow="About the project"
      title="A safety layer for the infrastructure cities already have"
      description="SafeStreet AI is a prototype that shows how existing street furniture — lights, poles, cameras — can be turned into a distributed network that notices danger and tells someone who can act on it."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {points.map((p) => (
          <GlassCard key={p.title} glow="signal">
            <p.icon className="mb-4 text-2xl text-signal-soft" />
            <h3 className="text-lg font-semibold text-white">{p.title}</h3>
            <p className="mt-2 text-sm text-slate-400">{p.body}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
