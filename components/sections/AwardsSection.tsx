'use client';

import { motion } from 'framer-motion';
import { Award as AwardIcon, ExternalLink } from 'lucide-react';
import type { Award } from '@/types/content';

interface AwardsSectionProps {
  awards: Award[];
}

export function AwardsSection({ awards }: AwardsSectionProps) {
  if (!awards || awards.length === 0) {
    return null;
  }

  return (
    <section
      id="awards"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/50"
      aria-labelledby="awards-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            id="awards-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Awards & Recognition
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Honored for technical excellence, innovation, and leadership
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {awards.map((award, index) => (
            <motion.article
              key={award.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-strong p-6 sm:p-8 rounded-3xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  {award.icon || <AwardIcon className="w-7 h-7 text-yellow-500" />}
                </div>

                <div className="flex-1 space-y-2">
                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-foreground">
                    {award.url ? (
                      <a
                        href={award.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors inline-flex items-center gap-2 group/link"
                      >
                        {award.title}
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      award.title
                    )}
                  </h3>

                  {/* Issuer and Date */}
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-primary">{award.issuer}</span>
                    <span className="text-muted-foreground">•</span>
                    <time className="text-muted-foreground" dateTime={award.date}>
                      {new Date(award.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </time>
                  </div>

                  {/* Description */}
                  {award.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed pt-2">
                      {award.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
