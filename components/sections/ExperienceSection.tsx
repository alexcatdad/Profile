'use client';

import { motion, useInView } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';
import { useRef } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import type { WorkExperience } from '@/types/content';

interface ExperienceSectionProps {
  experience: WorkExperience[];
  dictionary: Dictionary;
}

export function ExperienceSection({ experience, dictionary }: ExperienceSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <section id="experience" ref={ref} className="py-32 px-4 relative overflow-hidden bg-gradient-to-b from-transparent via-accent/5 to-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="px-6 py-2 glass rounded-full text-sm font-semibold text-primary shadow-apple">
              Professional Journey
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            {dictionary.navigation.experience}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Building impactful solutions across diverse challenges and technologies
          </p>
        </motion.div>

        <div className="relative">
          {/* Enhanced Timeline line with gradient */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-primary rounded-full opacity-30" />
          <div className="absolute left-4 md:left-8 top-0 h-1/3 w-1 bg-gradient-to-b from-primary to-transparent rounded-full" />

          <div className="space-y-16">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative group"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: index * 0.2,
                  type: 'spring',
                  stiffness: 100
                }}
              >
                {/* Timeline dot with glassmorphism */}
                <div className="absolute left-0 md:left-4 top-8 z-10 flex-shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                    <div className="relative w-12 h-12 rounded-full glass-strong flex items-center justify-center shadow-apple-lg ring-4 ring-background/50">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-primary to-accent" />
                    </div>
                  </div>
                </div>

                {/* Content card with glassmorphism */}
                <motion.div
                  className="ml-20 md:ml-24"
                  whileHover={{ x: 4 }}
                >
                  <div className="relative group/card">
                    {/* Gradient glow on hover */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-0 group-hover/card:opacity-20 blur-xl transition-opacity duration-500" />

                    <div className="relative glass hover:glass-strong p-8 rounded-3xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-500">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                        <div className="flex-1">
                          <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            {exp.position}
                          </h3>
                          <p className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            {exp.company}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <div className="flex items-center gap-2 glass-subtle px-4 py-2 rounded-2xl">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="font-medium">{exp.location}</span>
                            </div>
                            <div className="flex items-center gap-2 glass-subtle px-4 py-2 rounded-2xl">
                              <Calendar className="w-4 h-4 text-accent" />
                              <span className="font-medium">
                                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        {exp.logo && (
                          <motion.img
                            src={exp.logo}
                            alt={`${exp.company} logo`}
                            className="w-20 h-20 object-contain rounded-2xl glass p-3 shadow-apple"
                            whileHover={{ scale: 1.05, rotate: 5 }}
                          />
                        )}
                      </div>

                      <ul className="space-y-4 mb-6">
                        {exp.description.map((desc, descIndex) => (
                          <motion.li
                            key={desc}
                            className="flex items-start gap-3 group/item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.2 + descIndex * 0.1
                            }}
                          >
                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent mt-2 group-hover/item:scale-150 transition-transform" />
                            <span className="leading-relaxed text-foreground/90">
                              {desc}
                            </span>
                          </motion.li>
                        ))}
                      </ul>

                      {exp.technologies && exp.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2.5 pt-6 border-t border-white/10">
                          {exp.technologies.map((tech) => (
                            <motion.span
                              key={tech}
                              className="px-4 py-2 glass-subtle hover:glass rounded-2xl text-xs font-semibold shadow-apple hover:text-primary transition-all duration-300"
                              whileHover={{ scale: 1.05, y: -2 }}
                            >
                              {tech}
                            </motion.span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
