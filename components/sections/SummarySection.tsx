'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { calculateTotalYearsOfExperience } from '@/lib/experience-calculator';
import type { Profile, WorkExperience } from '@/types/content';

interface SummarySectionProps {
  profile: Profile;
  experience: WorkExperience[];
}

export function SummarySection({ profile, experience }: SummarySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const [countedYears, setCountedYears] = useState(0);

  // Calculate total years from work experience
  const totalYears = calculateTotalYearsOfExperience(experience || []);

  // Initialize countedYears to totalYears if not animating
  useEffect(() => {
    if (totalYears > 0 && countedYears === 0 && !isInView) {
      // Set initial value if we have data but haven't started animating
      setCountedYears(totalYears);
    }
  }, [totalYears, isInView, countedYears]);

  useEffect(() => {
    // If totalYears is 0 or already counted, set it directly
    if (totalYears === 0) {
      setCountedYears(0);
      return;
    }

    // If already at target, don't animate
    if (countedYears >= totalYears) {
      return;
    }

    // Animate counter when in view
    if (isInView) {
      const duration = 1000;
      const steps = 60;
      const increment = totalYears / steps;
      const stepDuration = duration / steps;

      let current = countedYears;
      const timer = setInterval(() => {
        current += increment;
        if (current >= totalYears) {
          setCountedYears(totalYears);
          clearInterval(timer);
        } else {
          setCountedYears(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      // If not in view yet, set to 0
      setCountedYears(0);
    }
  }, [isInView, totalYears, countedYears]);

  return (
    <section id="summary" ref={ref} className="py-32 px-4 relative overflow-hidden bg-gradient-to-b from-transparent via-accent/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
          className="space-y-8 mb-16"
        >
          {profile.summary.map((paragraph, index) => (
            <motion.p
              key={paragraph}
              className="text-xl md:text-2xl text-foreground/90 leading-relaxed font-light text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                type: 'spring',
                stiffness: 100
              }}
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6, type: 'spring', stiffness: 100 }}
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-20 blur-xl" />
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-8 p-10 glass hover:glass-strong rounded-3xl shadow-apple-xl transition-all duration-500">
            <div className="flex items-center gap-8">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-50"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.7, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative px-10 py-6 bg-gradient-to-br from-primary via-accent to-primary rounded-3xl text-white font-extrabold text-5xl shadow-apple-xl">
                  {totalYears > 0 ? (countedYears > 0 ? countedYears : totalYears) : 0}+
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold text-foreground block mb-1">
                  Years of Experience
                </span>
                <span className="text-sm text-muted-foreground font-medium">Professional Development</span>
              </div>
            </div>
            <div className="flex items-center gap-3 glass-subtle px-6 py-4 rounded-2xl shadow-apple">
              <span className="text-2xl">📍</span>
              <span className="font-semibold text-lg">{profile.location}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
