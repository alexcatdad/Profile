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
    <section id="experience" ref={ref} className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {dictionary.navigation.experience}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary to-transparent transform md:-translate-x-1/2" />

          <div className="space-y-12">
            {experience.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative flex items-start gap-6"
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shadow-lg ring-4 ring-background">
                  <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                </div>

                {/* Content card */}
                <motion.div
                  className="flex-1 bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-card-foreground">
                        {exp.position}
                      </h3>
                      <p className="text-lg text-primary font-semibold mb-2">{exp.company}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
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
                        className="w-16 h-16 object-contain rounded-lg bg-background p-2 border border-border"
                      />
                    )}
                  </div>

                  <ul className="space-y-3 mb-4">
                    {exp.description.map((desc) => (
                      <motion.li
                        key={desc}
                        className="text-card-foreground flex items-start gap-3"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                      >
                        <span className="text-primary mt-1.5 flex-shrink-0">▸</span>
                        <span className="leading-relaxed">{desc}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-xs font-medium border border-border hover:border-primary/50 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
