import Section from './Section';
import GlassCard from '@/components/ui/GlassCard';

const stats = [
  { value: '6-12 min', label: 'Typical time for a bystander to report an incident' },
  { value: '~40%', label: 'Of public cameras are never actively monitored in real time' },
  { value: '0', label: 'Automated alerts most street cameras generate today' },
];

export default function Problem() {
  return (
    <Section
      id="problem"
      eyebrow="The problem"
      title="Cities already have eyes on the street. They don't have a way to notice."
      description="Most public safety cameras are passive — footage is reviewed after something has already gone wrong, if it's reviewed at all. The gap isn't visibility, it's response time."
    >
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((s) => (
          <GlassCard key={s.label} className="text-center">
            <div className="font-display text-3xl font-semibold text-danger">{s.value}</div>
            <p className="mt-2 text-sm text-slate-400">{s.label}</p>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
