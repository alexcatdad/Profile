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

        {/* Infographic Timeline */}
        <div className="relative">
          {/* Visual timeline line with gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary/20 rounded-full" />

          <div className="space-y-16">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative pl-12 sm:pl-16"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
              >
                {/* Animated timeline dot with pulse */}
                <motion.div
                  className="absolute left-0 top-2 -translate-x-1/2 z-10"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                  <div className="relative">
                    <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-background shadow-lg" />
                    <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-ping opacity-20" />
                  </div>
                </motion.div>

                {/* Content with infographic elements */}
                <div className="space-y-6 p-8 glass-subtle rounded-2xl shadow-apple border border-border/50 hover:border-primary/30 transition-all duration-300">
                  {/* Header with infographic elements */}
                  <div className="space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </span>
                          <h3 className="text-2xl sm:text-3xl font-black">
                            {exp.position}
                          </h3>
                        </div>
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
                        <motion.img
                          src={exp.logo}
                          alt={`${exp.company} logo`}
                          className="w-16 h-16 object-contain rounded-xl border border-border p-2 glass-subtle"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: index * 0.1 + 0.4 }}
                        />
                      )}
                    </div>

                    {/* Visual duration bar */}
                    <motion.div
                      className="relative h-2 bg-border/30 rounded-full overflow-hidden"
                      initial={{ scaleX: 0 }}
                      animate={isInView ? { scaleX: 1 } : {}}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      style={{ transformOrigin: 'left' }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary"
                        initial={{ x: '-100%' }}
                        animate={isInView ? { x: 0 } : {}}
                        transition={{ delay: index * 0.1 + 0.6, duration: 1 }}
                      />
                    </motion.div>
                  </div>

                  {/* Description with enhanced bullets */}
                  <ul className="space-y-3 text-base text-muted-foreground">
                    {exp.description.map((desc, descIndex) => (
                      <motion.li
                        key={desc}
                        className="flex items-start gap-3 group"
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.1 + descIndex * 0.05
                        }}
                      >
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary/60 mt-2 group-hover:bg-primary group-hover:scale-125 transition-all" />
                        <span className="leading-relaxed">{desc}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Technologies with visual badges */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="space-y-3 pt-4">
                      <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        <div className="w-1 h-1 rounded-full bg-primary" />
                        <span>Tech Stack</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIdx) => (
                          <motion.span
                            key={tech}
                            className="px-3 py-1.5 text-xs font-semibold text-primary/80 bg-primary/5 border border-primary/20 rounded-full hover:bg-primary/10 hover:border-primary/40 hover:scale-105 transition-all cursor-default shadow-sm"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: index * 0.1 + 0.7 + techIdx * 0.03 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
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
