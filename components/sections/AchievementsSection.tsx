'use client';

import { motion, useInView } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useRef } from 'react';
import type { Achievement } from '@/types/content';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <section
      id="achievements"
      ref={ref}
      className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12"
      aria-labelledby="achievements-heading"
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
            <Trophy className="w-4 h-4" />
            <span>Milestones</span>
          </motion.div>

          <h2
            id="achievements-heading"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight"
          >
            <span className="gradient-text-hero">Key Achievements</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Major accomplishments and impact throughout my career
          </motion.p>
        </motion.div>

        {/* Achievements list */}
        <div className="space-y-12">
          {achievements.map((achievement, index) => (
            <motion.article
              key={achievement.id}
              className="border-l border-border pl-8 sm:pl-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
              aria-label={achievement.title}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-2xl font-black text-foreground">
                    {achievement.title}
                  </h3>
                  {achievement.date && (
                    <time
                      className="text-sm text-muted-foreground"
                      dateTime={achievement.date}
                    >
                      {new Date(achievement.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </time>
                  )}
                </div>

                {/* Description */}
                <p className="text-base text-muted-foreground leading-relaxed">
                  {achievement.description}
                </p>

                {/* Metric */}
                {achievement.metric && (
                  <div className="inline-flex items-baseline gap-2 pt-2">
                    <span className="text-3xl font-black gradient-text-hero tabular-nums">
                      {achievement.metric.value}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      {achievement.metric.label}
                    </span>
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
