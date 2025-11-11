'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { enrichSkillsWithExperience } from '@/lib/skill-experience';
import type { Skill, WorkExperience } from '@/types/content';

interface SkillsSectionProps {
  skills: Skill[];
  experience: WorkExperience[];
  dictionary: Dictionary;
}

export function SkillsSection({ skills, experience, dictionary }: SkillsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  // Enrich skills with calculated years of experience
  const skillsWithExperience = enrichSkillsWithExperience(skills, experience);
  const categories = Array.from(new Set(skillsWithExperience.map((s) => s.category)));

  return (
    <section id="skills" ref={ref} className="py-32 px-4 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
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
              Technical Excellence
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            {dictionary.navigation.skills}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            A comprehensive toolkit refined through years of hands-on experience
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, categoryIndex) => {
            const categorySkills = skillsWithExperience.filter((s) => s.category === category);
            return (
              <motion.div
                key={category}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.7,
                  delay: categoryIndex * 0.15,
                  type: 'spring',
                  stiffness: 100
                }}
                whileHover={{ y: -8 }}
              >
                {/* Gradient glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                <div className="relative glass hover:glass-strong p-8 rounded-3xl shadow-apple hover:shadow-apple-xl transition-all duration-500 h-full">
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {category}
                    </h3>
                  </div>

                  {/* Skills grid */}
                  <div className="flex flex-wrap gap-2.5">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        className="flex items-center gap-2 group/skill"
                        initial={{ opacity: 0, scale: 0.7 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: categoryIndex * 0.15 + skillIndex * 0.04,
                          type: 'spring',
                          stiffness: 200
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="px-4 py-2 glass-subtle hover:glass rounded-2xl text-sm font-semibold text-foreground hover:text-primary transition-all duration-300 shadow-apple">
                          {skill.name}
                        </span>
                        {skill.yearsOfExperience > 0 && (
                          <motion.span
                            className="text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl shadow-apple"
                            title={`${skill.yearsOfExperience} years of experience`}
                            whileHover={{ scale: 1.1 }}
                          >
                            {skill.yearsOfExperience === Math.floor(skill.yearsOfExperience)
                              ? `${Math.floor(skill.yearsOfExperience)}y`
                              : `${skill.yearsOfExperience}y`}
                          </motion.span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
