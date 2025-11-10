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
    <section id="skills" ref={ref} className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {dictionary.navigation.skills}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, categoryIndex) => {
            const categorySkills = skillsWithExperience.filter((s) => s.category === category);
            return (
              <motion.div
                key={category}
                className="group bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/50"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <h3 className="text-xl font-semibold mb-4 text-card-foreground flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full" />
                  {category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      className="flex items-center gap-2 group/skill"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{
                        duration: 0.3,
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      }}
                    >
                      <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors">
                        {skill.name}
                      </span>
                      {skill.yearsOfExperience > 0 && (
                        <span
                          className="text-xs text-muted-foreground font-semibold px-2 py-1 bg-muted rounded-full border border-border"
                          title={`${skill.yearsOfExperience} years of experience`}
                        >
                          {skill.yearsOfExperience === Math.floor(skill.yearsOfExperience)
                            ? `${Math.floor(skill.yearsOfExperience)}y`
                            : `${skill.yearsOfExperience}y`}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
