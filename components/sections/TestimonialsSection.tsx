'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import type { Testimonial } from '@/types/content';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section
      id="testimonials"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background/50 to-background"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            id="testimonials-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            What Colleagues Say
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Recommendations from managers, colleagues, and clients I've worked with
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-strong p-6 sm:p-8 rounded-3xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-300 group hover:-translate-y-1"
              aria-label={`Testimonial from ${testimonial.name}, ${testimonial.position} at ${testimonial.company}`}
            >
              {/* Quote Icon */}
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <Quote className="w-6 h-6 text-primary" />
                </div>

                {/* Relationship Badge */}
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                    {testimonial.relationship}
                  </span>
                </div>
              </div>

              {/* Testimonial Text */}
              <blockquote>
                <p className="text-base sm:text-lg text-foreground/90 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
              </blockquote>

              {/* Author Info */}
              <footer className="flex items-center gap-4 pt-4 border-t border-white/10">
                {testimonial.avatar && (
                  <div className="flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center glass-subtle"
                      aria-hidden="true"
                    >
                      <span className="text-lg font-bold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="font-bold text-foreground text-sm sm:text-base">
                    {testimonial.linkedinUrl ? (
                      <a
                        href={testimonial.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors inline-flex items-center gap-1"
                        aria-label={`${testimonial.name}'s LinkedIn profile`}
                      >
                        {testimonial.name}
                        <span className="text-xs" aria-hidden="true">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <span>{testimonial.name}</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {testimonial.position}
                  </div>
                  <div className="text-xs text-muted-foreground/80 truncate">
                    {testimonial.company}
                  </div>
                </div>

                {testimonial.date && (
                  <div className="text-xs text-muted-foreground/60">
                    {new Date(testimonial.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </div>
                )}
              </footer>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
