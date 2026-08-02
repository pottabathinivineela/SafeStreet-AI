import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import clsx from '@/utils/clsx';

interface SectionProps {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  align?: 'left' | 'center';
}

export default function Section({ id, eyebrow, title, description, children, className, align = 'left' }: SectionProps) {
  return (
    <section id={id} className={clsx('py-20 md:py-28', className)}>
      <div className="container-px mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className={clsx('max-w-2xl', align === 'center' && 'mx-auto text-center')}
        >
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
          {description && <p className="mt-4 text-slate-400">{description}</p>}
        </motion.div>
        {children && <div className="mt-14">{children}</div>}
      </div>
    </section>
  );
}
