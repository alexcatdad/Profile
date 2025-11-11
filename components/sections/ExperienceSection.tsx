'use client';

import { motion, useInView } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { useRef } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import type { WorkExperience } from '@/types/content';

interface ExperienceSectionProps {
  experience: WorkExperience[];
  dictionary: Dictionary;
}

export function ExperienceSection({ experience, dictionary }: ExperienceSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section id="experience" ref={ref} className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
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
            <Briefcase className="w-4 h-4" />
            <span>Professional Journey</span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
            <span className="gradient-text-hero">{dictionary.navigation.experience}</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Building impactful solutions across diverse challenges
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Minimal timeline line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-16">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative pl-8 sm:pl-12"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-2 -translate-x-1/2">
                  <div className="w-2 h-2 rounded-full bg-foreground ring-4 ring-background" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-2xl sm:text-3xl font-black mb-2">
                        {exp.position}
                      </h3>
                      <p className="text-lg font-bold text-primary mb-3">
                        {exp.company}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    {exp.logo && (
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        className="w-16 h-16 object-contain rounded-xl border border-border p-2"
                      />
                    )}
                  </div>

                  {/* Description */}
                  <ul className="space-y-3 text-base text-muted-foreground">
                    {exp.description.map((desc, descIndex) => (
                      <motion.li
                        key={desc}
                        className="flex items-start gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.1 + descIndex * 0.05
                        }}
                      >
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-foreground/40 mt-2" />
                        <span className="leading-relaxed">{desc}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs font-semibold text-foreground/70 border border-border rounded-full hover:border-primary/30 hover:text-foreground transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
