import Section from './Section';
import StatCounter from '@/components/ui/StatCounter';

export default function ImpactStats() {
  return (
    <Section id="impact" eyebrow="Projected impact" title="What this loop is designed to do at scale" align="center">
      <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
        <StatCounter value={2} suffix="s" label="Avg. detection-to-alert time*" />
        <StatCounter value={24} label="Hour monitoring coverage" />
        <StatCounter value={98} suffix="%" label="Simulated detection accuracy*" />
        <StatCounter value={100} suffix="+" label="Poles per network segment*" />
      </div>
      <p className="mt-8 text-center text-xs text-slate-600">*Prototype targets for demonstration, not measured production figures.</p>
    </Section>
  );
}
