'use client';

import { motion, useInView } from 'framer-motion';
import { type ReactNode, useRef } from 'react';

interface AnimatedSectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  delay?: number;
}

export function AnimatedSection({ id, className = '', children, delay = 0 }: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <motion.section
      id={id}
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.section>
  );
}
