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
    <section id="summary" ref={ref} className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="space-y-6 mb-12"
        >
          {profile.summary.map((paragraph, index) => (
            <motion.p
              key={paragraph}
              className="text-lg md:text-xl text-foreground leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.15 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-card border border-border rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="px-8 py-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl font-bold text-4xl shadow-lg">
                {totalYears > 0 ? (countedYears > 0 ? countedYears : totalYears) : 0}+
              </div>
              <motion.div
                className="absolute inset-0 bg-primary rounded-2xl blur-xl opacity-50"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <span className="text-lg font-semibold text-muted-foreground block">
                Years of Experience
              </span>
              <span className="text-sm text-muted-foreground">Professional Development</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground px-4 py-2 bg-muted rounded-lg">
            <span className="text-xl">📍</span>
            <span className="font-medium">{profile.location}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
