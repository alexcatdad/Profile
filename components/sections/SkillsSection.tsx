'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
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
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Enrich skills with calculated years of experience
  const skillsWithExperience = enrichSkillsWithExperience(skills, experience);
  const categories = ['all', ...Array.from(new Set(skillsWithExperience.map((s) => s.category)))];

  // Filter skills
  const filteredSkills = skillsWithExperience.filter((skill) => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categoriesWithSkills = Array.from(
    new Set(filteredSkills.map((s) => s.category))
  );

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'expert':
        return 'from-green-500 to-emerald-600';
      case 'advanced':
        return 'from-blue-500 to-cyan-600';
      case 'intermediate':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getLevelLabel = (level?: string) => {
    return level ? level.charAt(0).toUpperCase() + level.slice(1) : '';
  };

  return (
    <section id="skills" ref={ref} className="py-16 sm:py-24 px-4 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12 sm:mb-16"
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
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            {dictionary.navigation.skills}
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto font-light mb-8">
            {skillsWithExperience.length} technologies refined through years of hands-on experience
          </p>

          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 glass-subtle rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground/50 transition-all shadow-apple"
                aria-label="Search skills"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-apple-lg'
                      : 'glass hover:glass-strong text-foreground/70 hover:text-foreground shadow-apple'
                  }`}
                  aria-pressed={selectedCategory === category}
                >
                  {category === 'all' ? 'All' : category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {categoriesWithSkills.map((category, categoryIndex) => {
            const categorySkills = filteredSkills.filter((s) => s.category === category);
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
                  stiffness: 100,
                }}
                whileHover={{ y: -8 }}
              >
                {/* Gradient glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                <div className="relative glass hover:glass-strong p-6 sm:p-8 rounded-3xl shadow-apple hover:shadow-apple-xl transition-all duration-500 h-full">
                  {/* Category header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent group-hover:scale-150 transition-transform duration-300" />
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {category}
                    </h3>
                    <span className="ml-auto text-sm font-semibold text-muted-foreground">
                      {categorySkills.length}
                    </span>
                  </div>

                  {/* Skills with proficiency */}
                  <div className="space-y-4">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: categoryIndex * 0.15 + skillIndex * 0.05,
                        }}
                      >
                        <div className="space-y-2">
                          {/* Skill name and badges */}
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-sm sm:text-base">
                                {skill.name}
                              </span>
                              {skill.highlighted && (
                                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-xs font-bold">
                                  ⭐
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {skill.yearsOfExperience && skill.yearsOfExperience > 0 && (
                                <span className="text-xs font-bold px-2 py-1 bg-gradient-to-r from-primary to-accent text-white rounded-lg">
                                  {Math.floor(skill.yearsOfExperience)}y
                                </span>
                              )}
                              {skill.level && (
                                <span
                                  className={`text-xs font-semibold px-2 py-1 rounded-lg bg-gradient-to-r ${getLevelColor(
                                    skill.level
                                  )} text-white`}
                                >
                                  {getLevelLabel(skill.level)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Proficiency bar */}
                          {skill.proficiency !== undefined && (
                            <div className="relative">
                              <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full bg-gradient-to-r ${getLevelColor(
                                    skill.level
                                  )} rounded-full`}
                                  initial={{ width: 0 }}
                                  animate={isInView ? { width: `${skill.proficiency}%` } : {}}
                                  transition={{
                                    duration: 1,
                                    delay: categoryIndex * 0.15 + skillIndex * 0.05 + 0.2,
                                    ease: 'easeOut',
                                  }}
                                />
                              </div>
                              <span className="absolute -top-1 right-0 text-xs font-bold text-muted-foreground">
                                {skill.proficiency}%
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredSkills.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 text-muted-foreground"
          >
            No skills found matching your search.
          </motion.div>
        )}
      </div>
    </section>
  );
}
