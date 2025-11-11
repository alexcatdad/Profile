'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, Sparkles, Trophy, Zap } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { enrichSkillsWithExperience } from '@/lib/skill-experience';
import type { Skill, WorkExperience } from '@/types/content';

interface SkillsSectionProps {
  skills: Skill[];
  experience: WorkExperience[];
  dictionary: Dictionary;
}

// 3D Flip Card Component
function SkillCard({
  skill,
  index,
  isInView,
}: {
  skill: Skill;
  index: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'expert':
        return 'from-emerald-500 via-green-500 to-teal-600';
      case 'advanced':
        return 'from-blue-500 via-cyan-500 to-sky-600';
      case 'intermediate':
        return 'from-yellow-500 via-orange-500 to-amber-600';
      default:
        return 'from-gray-400 via-gray-500 to-slate-500';
    }
  };

  const getLevelIcon = (level?: string) => {
    switch (level) {
      case 'expert':
        return <Trophy className="w-4 h-4" />;
      case 'advanced':
        return <Zap className="w-4 h-4" />;
      case 'intermediate':
        return <Sparkles className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="perspective h-64 cursor-pointer"
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        type: 'spring',
        stiffness: 100,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-2xl"
        style={{
          background: `linear-gradient(135deg, rgba(var(--primary-rgb), 0.6), rgba(var(--accent-rgb), 0.6))`,
        }}
        animate={{
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 glass-strong rounded-2xl p-6 shadow-apple-xl backface-hidden overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb), 0.1), transparent 70%)`,
            }}
          />

          <div className="relative h-full flex flex-col justify-between">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <motion.h3
                  className="text-2xl font-black gradient-text-hero"
                  whileHover={{ scale: 1.05 }}
                >
                  {skill.name}
                </motion.h3>
                {skill.highlighted && (
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-400" />
                  </motion.div>
                )}
              </div>

              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl glass text-xs font-bold"
                whileHover={{ scale: 1.05 }}
              >
                <span className={`text-transparent bg-gradient-to-r ${getLevelColor(skill.level)} bg-clip-text`}>
                  {skill.level?.toUpperCase() || 'LEARNING'}
                </span>
              </motion.div>
            </div>

            {/* Circular progress */}
            {skill.proficiency !== undefined && (
              <div className="flex items-center justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      className="stroke-muted/20"
                      strokeWidth="8"
                      fill="none"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="56"
                      className={`stroke-current bg-gradient-to-r ${getLevelColor(skill.level)}`}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: '0 352' }}
                      animate={
                        isInView
                          ? {
                              strokeDasharray: `${(skill.proficiency / 100) * 352} 352`,
                            }
                          : {}
                      }
                      transition={{ duration: 1.5, delay: index * 0.05 + 0.3, ease: 'easeOut' }}
                      style={{
                        stroke: `url(#gradient-${skill.name.replace(/\s+/g, '-')})`,
                      }}
                    />
                    <defs>
                      <linearGradient
                        id={`gradient-${skill.name.replace(/\s+/g, '-')}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      className="text-4xl font-black gradient-text-hero"
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : {}}
                      transition={{ delay: index * 0.05 + 0.5, type: 'spring', bounce: 0.6 }}
                    >
                      {skill.proficiency}
                    </motion.span>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              {skill.yearsOfExperience && skill.yearsOfExperience > 0 && (
                <motion.div
                  className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl"
                  whileHover={{ scale: 1.1 }}
                >
                  {getLevelIcon(skill.level)}
                  <span className="text-sm font-black">
                    {Math.floor(skill.yearsOfExperience)}+ years
                  </span>
                </motion.div>
              )}
              <motion.div
                className="text-xs text-muted-foreground font-semibold"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Click to flip
              </motion.div>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 glass-strong rounded-2xl p-6 shadow-apple-xl backface-hidden overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="relative h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-foreground">{skill.name}</h3>
              <motion.button
                className="px-3 py-1.5 glass hover:glass-strong rounded-xl text-xs font-bold"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                Flip Back
              </motion.button>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="p-4 glass rounded-xl">
                <div className="text-xs text-muted-foreground font-semibold mb-1">Category</div>
                <div className="text-sm font-bold gradient-text">{skill.category}</div>
              </div>

              {skill.yearsOfExperience && (
                <div className="p-4 glass rounded-xl">
                  <div className="text-xs text-muted-foreground font-semibold mb-1">Experience</div>
                  <div className="text-sm font-bold">
                    {Math.floor(skill.yearsOfExperience)} years, {Math.round((skill.yearsOfExperience % 1) * 12)} months
                  </div>
                </div>
              )}

              {skill.lastUsed && (
                <div className="p-4 glass rounded-xl">
                  <div className="text-xs text-muted-foreground font-semibold mb-1">Last Used</div>
                  <div className="text-sm font-bold">{skill.lastUsed}</div>
                </div>
              )}

              <div className="p-4 glass rounded-xl">
                <div className="text-xs text-muted-foreground font-semibold mb-1">Proficiency</div>
                <div className="flex items-center gap-2">
                  <div className="flex-grow h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getLevelColor(skill.level)}`}
                      style={{ width: `${skill.proficiency || 0}%` }}
                    />
                  </div>
                  <span className="text-sm font-black">{skill.proficiency}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function SkillsSection({ skills, experience, dictionary }: SkillsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
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

  return (
    <section id="skills" ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'rgba(var(--primary-rgb), 0.15)' : 'rgba(var(--accent-rgb), 0.15)'
              } 0%, transparent 70%)`,
              left: `${20 + i * 30}%`,
              top: `${10 + i * 25}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12 + i * 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-8 py-4 glass-strong rounded-full shadow-glow"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', bounce: 0.5 }}
          >
            <Zap className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-base font-black gradient-text">Technical Arsenal</span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none">
            <span className="block gradient-text-hero">{dictionary.navigation.skills}</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto font-light mb-12"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {skillsWithExperience.length} technologies mastered through years of real-world experience
          </motion.p>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto">
            <motion.div
              className="flex-1 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Search your next tech stack..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 glass-strong rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground/50 transition-all shadow-apple-lg font-semibold"
              />
            </motion.div>

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-4 rounded-2xl font-black text-sm whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-glow'
                      : 'glass-strong hover:glass text-foreground/70 hover:text-foreground shadow-apple'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category === 'all' ? 'All Skills' : category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} isInView={isInView} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl font-bold text-muted-foreground">No skills found</p>
            <p className="text-lg text-muted-foreground/70 mt-2">Try a different search or category</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
