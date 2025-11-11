'use client';

import { motion, useInView } from 'framer-motion';
import { Search, Zap } from 'lucide-react';
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
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const skillsWithExperience = enrichSkillsWithExperience(skills, experience);
  const categories = ['all', ...Array.from(new Set(skillsWithExperience.map((s) => s.category)))];

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
        return 'bg-emerald-500';
      case 'advanced':
        return 'bg-blue-500';
      case 'intermediate':
        return 'bg-orange-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <section id="skills" ref={ref} className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
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
            <Zap className="w-4 h-4" />
            <span>Technical Arsenal</span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
            <span className="gradient-text-hero">{dictionary.navigation.skills}</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            {skillsWithExperience.length} technologies refined through years of hands-on experience
          </motion.p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent border border-border rounded-xl focus:outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50 transition-colors"
              />
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-3 text-sm font-semibold whitespace-nowrap rounded-xl transition-colors ${
                    selectedCategory === category
                      ? 'bg-foreground text-background'
                      : 'border border-border text-foreground/70 hover:text-foreground hover:border-foreground/20'
                  }`}
                >
                  {category === 'all' ? 'All Skills' : category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skills by category */}
        {filteredSkills.length > 0 ? (
          <div className="space-y-16">
            {categoriesWithSkills.map((category, categoryIndex) => {
              const categorySkills = filteredSkills.filter((s) => s.category === category);
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: categoryIndex * 0.1,
                  }}
                >
                  {/* Category header */}
                  <div className="flex items-center gap-4 mb-8">
                    <h3 className="text-2xl sm:text-3xl font-black">{category}</h3>
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                      {categorySkills.length}
                    </span>
                  </div>

                  {/* Skills grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        className="group"
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{
                          duration: 0.4,
                          delay: categoryIndex * 0.1 + skillIndex * 0.03,
                        }}
                      >
                        <div className="space-y-3">
                          {/* Skill name and metadata */}
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="font-bold text-foreground text-base">
                              {skill.name}
                            </span>
                            <div className="flex items-center gap-2 text-xs">
                              {skill.yearsOfExperience && skill.yearsOfExperience > 0 && (
                                <span className="font-semibold text-muted-foreground tabular-nums">
                                  {Math.floor(skill.yearsOfExperience)}y
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Progress bar - minimal */}
                          {skill.proficiency !== undefined && (
                            <div className="relative">
                              <div className="h-1 bg-border rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full ${getLevelColor(skill.level)} rounded-full`}
                                  initial={{ width: 0 }}
                                  animate={isInView ? { width: `${skill.proficiency}%` } : {}}
                                  transition={{
                                    duration: 1,
                                    delay: categoryIndex * 0.1 + skillIndex * 0.03 + 0.2,
                                    ease: 'easeOut',
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-xl text-muted-foreground">No skills found matching your search.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
