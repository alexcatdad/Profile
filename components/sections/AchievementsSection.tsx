'use client';

import { motion } from 'framer-motion';
import type { Achievement } from '@/types/content';

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (!achievements || achievements.length === 0) {
    return null;
  }

  return (
    <section
      id="achievements"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="achievements-heading"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            id="achievements-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Key Achievements
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Major milestones and accomplishments throughout my career
          </p>
        </motion.div>

        <div className="space-y-6">
          {achievements.map((achievement, index) => (
            <motion.article
              key={achievement.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-strong p-6 sm:p-8 rounded-3xl shadow-apple hover:shadow-apple-lg transition-all duration-300 group hover:translate-x-2"
              aria-label={achievement.title}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Icon */}
                {achievement.icon && (
                  <div
                    className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  >
                    {achievement.icon}
                  </div>
                )}

                <div className="flex-1 space-y-3">
                  {/* Title and Date */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      {achievement.title}
                    </h3>
                    {achievement.date && (
                      <time
                        className="text-sm text-muted-foreground/70"
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
                    <div className="flex items-center gap-2 pt-2">
                      <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                        <span className="text-2xl font-extrabold text-primary">
                          {achievement.metric.value}
                        </span>
                        <span className="text-sm font-semibold text-muted-foreground ml-2">
                          {achievement.metric.label}
                        </span>
                      </div>
                    </div>
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
