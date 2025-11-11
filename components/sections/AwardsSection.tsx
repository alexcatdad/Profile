'use client';

import { motion, useInView } from 'framer-motion';
import { Award as AwardIcon, ExternalLink } from 'lucide-react';
import { useRef } from 'react';
import type { Award } from '@/types/content';

interface AwardsSectionProps {
  awards: Award[];
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <section
      id="awards"
      ref={ref}
      className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12"
      aria-labelledby="awards-heading"
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
            <AwardIcon className="w-4 h-4" />
            <span>Recognition</span>
          </motion.div>

          <h2
            id="awards-heading"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight"
          >
            <span className="gradient-text-hero">Awards & Recognition</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Honored for technical excellence and innovation
          </motion.p>
        </motion.div>

        {/* Awards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
          {awards.map((award, index) => (
            <motion.article
              key={award.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
            >
              <div className="space-y-3 p-6 glass-subtle rounded-2xl shadow-apple">
                <h3 className="text-xl font-black text-foreground">
                  {award.url ? (
                    <a
                      href={award.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors inline-flex items-center gap-2 group"
                    >
                      {award.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    award.title
                  )}
                </h3>

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-primary">{award.issuer}</span>
                  {award.date && (
                    <>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{award.date}</span>
                    </>
                  )}
                </div>

                {award.description && (
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {award.description}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
