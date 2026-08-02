import { useState } from 'react';
import Section from './Section';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { FiCheckCircle } from 'react-icons/fi';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Enter your name.';
  if (!form.email.trim()) errors.email = 'Enter your email.';
  else if (!EMAIL_RE.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.message.trim()) errors.message = 'Add a short message.';
  else if (form.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    }
  };

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Bring SafeStreet AI to your city"
      description="Tell us about your deployment — a campus, a district, a transit corridor — and we'll follow up."
      align="center"
    >
      <div className="mx-auto max-w-xl">
        <GlassCard glow="signal">
          {submitted ? (
            <div className="flex flex-col items-center py-8 text-center">
              <FiCheckCircle className="mb-3 text-4xl text-safe" />
              <h3 className="text-lg font-semibold text-white">Message sent</h3>
              <p className="mt-1 text-sm text-slate-400">Thanks for reaching out — we'll get back to you shortly.</p>
              <Button variant="ghost" className="mt-5" onClick={() => setSubmitted(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
              <div>
                <label className="mb-1.5 block text-sm text-slate-300">Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-base-900/60 px-3.5 py-2.5 text-sm text-white outline-none focus:border-signal"
                  placeholder="Jordan Reyes"
                />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-300">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-base-900/60 px-3.5 py-2.5 text-sm text-white outline-none focus:border-signal"
                  placeholder="jordan@city.gov"
                />
                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-300">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full resize-none rounded-xl border border-white/10 bg-base-900/60 px-3.5 py-2.5 text-sm text-white outline-none focus:border-signal"
                  placeholder="Tell us about your deployment..."
                />
                {errors.message && <p className="mt-1 text-xs text-danger">{errors.message}</p>}
              </div>
              <Button type="submit" className="w-full">Send message</Button>
            </form>
          )}
        </GlassCard>
      </div>
    </Section>
  );
}
