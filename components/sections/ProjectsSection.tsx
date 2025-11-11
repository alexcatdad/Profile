'use client';

import { motion, useInView } from 'framer-motion';
import { ExternalLink, Github, Star, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import type { Project } from '@/types/content';

interface ProjectsSectionProps {
  projects: Project[];
  dictionary: Dictionary;
}

function AnimatedCounter({
  target,
  duration = 1000,
  isInView,
}: {
  target: number;
  duration?: number;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [target, duration, isInView]);

  return <span>{count.toLocaleString()}</span>;
}

// Clean minimal project card
function ProjectCard({
  project,
  index,
  isInView,
}: {
  project: Project;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Glassmorphism container with border accent */}
      <div className="relative p-8 sm:p-10 glass-subtle rounded-2xl border-l-2 border-border hover:border-primary/50 transition-colors duration-500 h-full shadow-apple">
        {/* Hover accent line */}
        <motion.div
          className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-primary to-accent origin-top"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
        />

        {/* Featured badge - minimal */}
        {project.featured && (
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-yellow-500/20 bg-yellow-500/5 rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            <Sparkles className="w-3 h-3 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">Featured</span>
          </motion.div>
        )}

        {/* Content */}
        <div className="space-y-6">
          {/* Title */}
          <motion.h3
            className="text-3xl sm:text-4xl font-black gradient-text-hero leading-tight"
            whileHover={{ x: 4 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {project.name}
          </motion.h3>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {project.description}
          </p>

          {/* Stats - inline */}
          {(project.stars !== undefined || project.downloads !== undefined) && (
            <div className="flex items-center gap-6 pt-4">
              {project.stars !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                  <span className="font-semibold tabular-nums">
                    <AnimatedCounter target={project.stars} isInView={isInView} />
                  </span>
                  <span className="text-muted-foreground">stars</span>
                </div>
              )}
              {project.downloads !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-semibold tabular-nums">
                    <AnimatedCounter target={project.downloads} isInView={isInView} />
                  </span>
                  <span className="text-muted-foreground">downloads</span>
                </div>
              )}
            </div>
          )}

          {/* Technologies - minimal pills */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {project.technologies.slice(0, 8).map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-semibold text-foreground/70 border border-border rounded-full hover:border-primary/30 hover:text-foreground transition-colors"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 8 && (
                <span className="px-3 py-1 text-xs font-semibold text-muted-foreground">
                  +{project.technologies.length - 8}
                </span>
              )}
            </div>
          )}

          {/* Link */}
          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors group/link pt-2"
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Github className="w-4 h-4" />
              <span>View Project</span>
              <ExternalLink className="w-3 h-3 opacity-0 -ml-2 group-hover/link:opacity-100 group-hover/link:ml-0 transition-all" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ProjectsSection({ projects, dictionary }: ProjectsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  // Sort projects to get featured ones first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <section id="projects" ref={ref} className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12">
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
            <Sparkles className="w-4 h-4" />
            <span>Featured Work</span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight">
            <span className="gradient-text-hero">{dictionary.navigation.projects}</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Building products that make a difference
          </motion.p>
        </motion.div>

        {/* Projects List - Clean vertical layout */}
        <div className="space-y-16 sm:space-y-20">
          {sortedProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} isInView={isInView} />
          ))}
        </div>

        {/* Summary stats - minimal */}
        <motion.div
          className="mt-24 pt-12 border-t border-border"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <div className="grid grid-cols-3 gap-8 max-w-2xl">
            <div>
              <div className="text-4xl sm:text-5xl font-black gradient-text-hero mb-2 tabular-nums">
                {projects.length}+
              </div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black gradient-text-hero mb-2 tabular-nums">
                {projects.reduce((sum, p) => sum + (p.stars || 0), 0)}+
              </div>
              <div className="text-sm text-muted-foreground">Stars</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black gradient-text-hero mb-2 tabular-nums">
                100%
              </div>
              <div className="text-sm text-muted-foreground">Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
