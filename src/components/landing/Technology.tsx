import Section from './Section';
import { Badge } from '@/components/ui/Badge';

const stack = [
  { group: 'Frontend', items: ['React + Vite', 'TypeScript', 'Tailwind CSS', 'Framer Motion'] },
  { group: 'Sensing', items: ['WebRTC Camera', 'Web Audio API', 'File Upload'] },
  { group: 'Mapping', items: ['Leaflet', 'OpenStreetMap'] },
  { group: 'Alerts', items: ['EmailJS', 'Notification System'] },
  { group: 'Future AI backend', items: ['YOLO', 'OpenCV', 'Whisper', 'Roboflow'] },
];

export default function Technology() {
  return (
    <Section
      id="technology"
      eyebrow="Technology"
      title="Built to swap simulation for real inference"
      description="The current detection engine runs on randomized timers so every feature is demoable without a model server. Its output shape matches what a real computer-vision or speech model would return, so upgrading later is a service swap, not a rewrite."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stack.map((s) => (
          <div key={s.group} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <h3 className="eyebrow">{s.group}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {s.items.map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
