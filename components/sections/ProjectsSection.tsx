'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Download, ExternalLink, Github, Star, Sparkles, TrendingUp } from 'lucide-react';
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

// 3D Card with magnetic hover effect
function ProjectCard({
  project,
  index,
  isInView,
  gridArea,
}: {
  project: Project;
  index: number;
  isInView: boolean;
  gridArea?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
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

  return (
    <motion.div
      ref={cardRef}
      className="group relative h-full perspective"
      style={{ gridArea }}
      initial={{ opacity: 0, scale: 0.8, rotateX: -20 }}
      animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 80,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dramatic glow */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-3xl opacity-0 blur-2xl"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="relative glass-strong p-8 rounded-3xl shadow-apple-xl h-full flex flex-col overflow-hidden preserve-3d"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ z: 50 }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(var(--primary-rgb), 0.15), transparent 50%)',
          }}
        />

        {project.featured && (
          <motion.div
            className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 text-xs font-black rounded-xl shadow-glow flex items-center gap-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5 + index * 0.1, type: 'spring', bounce: 0.6 }}
            style={{ transform: 'translateZ(20px)' }}
          >
            <Sparkles className="w-3 h-3" />
            FEATURED
          </motion.div>
        )}

        <motion.div
          style={{ transform: 'translateZ(30px)' }}
          className="relative z-10"
        >
          <h4 className="text-3xl font-black mb-4 gradient-text-hero leading-tight">
            {project.name}
          </h4>
          <p className="text-muted-foreground mb-6 leading-relaxed flex-grow text-lg">
            {project.description}
          </p>

          {(project.stars !== undefined || project.downloads !== undefined) && (
            <div className="flex flex-wrap gap-3 mb-6">
              {project.stars !== undefined && (
                <motion.div
                  className="flex items-center gap-2 glass px-4 py-2 rounded-xl shadow-apple"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-black text-sm">
                    <AnimatedCounter target={project.stars} isInView={isInView} />
                  </span>
                </motion.div>
              )}
              {project.downloads !== undefined && (
                <motion.div
                  className="flex items-center gap-2 glass px-4 py-2 rounded-xl shadow-apple"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="font-black text-sm">
                    <AnimatedCounter target={project.downloads} isInView={isInView} />
                  </span>
                </motion.div>
              )}
            </div>
          )}

          {project.githubUrl && (
            <motion.a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mb-6 px-6 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-2xl transition-all duration-300 font-black text-sm flex items-center justify-center gap-3 group/link shadow-glow-accent"
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              style={{ transform: 'translateZ(40px)' }}
            >
              <Github className="w-5 h-5" />
              <span>View Project</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10">
              {project.technologies.slice(0, 6).map((tech, i) => (
                <motion.span
                  key={tech}
                  className="px-3 py-1.5 glass hover:glass-strong rounded-xl text-xs font-bold shadow-apple"
                  whileHover={{ scale: 1.15, y: -5 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  style={{ transform: 'translateZ(20px)' }}
                >
                  {tech}
                </motion.span>
              ))}
              {project.technologies.length > 6 && (
                <span className="px-3 py-1.5 glass-subtle rounded-xl text-xs font-bold">
                  +{project.technologies.length - 6} more
                </span>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function ProjectsSection({ projects, dictionary }: ProjectsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  // Sort projects to get featured ones first
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return 0;
  });

  return (
    <section id="projects" ref={ref} className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-accent/20 to-primary/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
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
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-base font-black gradient-text">Featured Work</span>
          </motion.div>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none">
            <span className="block gradient-text-hero">{dictionary.navigation.projects}</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Crafting innovative solutions that push boundaries
          </motion.p>
        </motion.div>

        {/* Bento Grid - Asymmetric Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-fr">
          {sortedProjects.map((project, index) => (
            <div
              key={project.id}
              className={`
                ${index === 0 && project.featured ? 'md:col-span-2 md:row-span-2' : ''}
                ${index === 1 && projects.length > 3 ? 'lg:row-span-2' : ''}
                ${index === 3 && projects.length > 5 ? 'md:col-span-2' : ''}
              `}
            >
              <ProjectCard
                project={project}
                index={index}
                isInView={isInView}
              />
            </div>
          ))}
        </div>

        {/* Stats banner */}
        <motion.div
          className="mt-20 glass-strong p-8 rounded-3xl shadow-apple-xl"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-black gradient-text-hero mb-2">
                {projects.length}+
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-semibold">
                Projects Delivered
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-black gradient-text-hero mb-2">
                {projects.reduce((sum, p) => sum + (p.stars || 0), 0)}+
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-semibold">
                GitHub Stars
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-black gradient-text-hero mb-2">
                100%
              </div>
              <div className="text-sm sm:text-base text-muted-foreground font-semibold">
                Client Satisfaction
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
