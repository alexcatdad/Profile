'use client';

import { motion, useInView } from 'framer-motion';
import { MessageSquareQuote } from 'lucide-react';
import { useRef } from 'react';
import type { Testimonial } from '@/types/content';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      ref={ref}
      className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-20 sm:mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-primary"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Recommendations</span>
          </motion.div>

          <h2
            id="testimonials-heading"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight"
          >
            <span className="gradient-text-hero">What Colleagues Say</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Recommendations from people I've worked with
          </motion.p>
        </motion.div>

        {/* Testimonials list */}
        <div className="space-y-12">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              className="border-l-2 border-border pl-8 sm:pl-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              aria-label={`Testimonial from ${testimonial.name}, ${testimonial.position} at ${testimonial.company}`}
            >
              {/* Relationship badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-primary/20 bg-primary/5 rounded-full text-xs font-semibold text-primary mb-4">
                {testimonial.relationship}
              </div>

              {/* Quote */}
              <blockquote className="mb-6">
                <p className="text-lg text-foreground leading-relaxed">
                  "{testimonial.text}"
                </p>
              </blockquote>

              {/* Author */}
              <footer className="flex items-center gap-3 text-sm">
                <div>
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-muted-foreground">
                    {testimonial.position} at {testimonial.company}
                  </div>
                </div>
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
