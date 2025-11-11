'use client';

import { motion, useInView } from 'framer-motion';
import { Download, ExternalLink, Github, Star } from 'lucide-react';
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

export function ProjectsSection({ projects, dictionary }: ProjectsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const openSourceProjects = projects.filter((p) => !p.private);
  const privateProjects = projects.filter((p) => p.private);

  return (
    <section id="projects" ref={ref} className="py-32 px-4 relative overflow-hidden">
      {/* Background gradient */}
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
              Portfolio Showcase
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            {dictionary.navigation.projects}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Crafting innovative solutions that make a difference
          </p>
        </motion.div>

        {openSourceProjects.length > 0 && (
          <div className="mb-20">
            <motion.h3
              className="text-3xl font-bold mb-12 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shadow-apple">
                <Github className="w-6 h-6 text-primary" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Open Source
              </span>
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {openSourceProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="group relative h-full"
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.15,
                    type: 'spring',
                    stiffness: 100
                  }}
                  whileHover={{ y: -8 }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                  <div className="relative glass hover:glass-strong p-8 rounded-3xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-500 h-full flex flex-col">
                    {project.featured && (
                      <motion.div
                        className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 text-xs font-bold rounded-xl shadow-apple"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                      >
                        ⭐ Featured
                      </motion.div>
                    )}

                    <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300">
                      {project.name}
                    </h4>
                    <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                      {project.description}
                    </p>

                    {(project.stars !== undefined || project.downloads !== undefined) && (
                      <div className="flex flex-wrap gap-3 mb-6">
                        {project.stars !== undefined && (
                          <div className="flex items-center gap-2 glass-subtle px-4 py-2 rounded-xl">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-sm">
                              <AnimatedCounter target={project.stars} isInView={isInView} />
                            </span>
                          </div>
                        )}
                        {project.downloads !== undefined && (
                          <div className="flex items-center gap-2 glass-subtle px-4 py-2 rounded-xl">
                            <Download className="w-4 h-4 text-primary" />
                            <span className="font-bold text-sm">
                              <AnimatedCounter target={project.downloads} isInView={isInView} />
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full mb-6 px-5 py-3 glass hover:glass-strong rounded-2xl transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-3 group/link shadow-apple hover:shadow-apple-lg hover:text-primary"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Github className="w-5 h-5" />
                        <span>View on GitHub</span>
                        <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 -ml-2 group-hover/link:ml-0 transition-all" />
                      </motion.a>
                    )}

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10">
                        {project.technologies.map((tech) => (
                          <motion.span
                            key={tech}
                            className="px-3 py-1.5 glass-subtle hover:glass rounded-xl text-xs font-semibold shadow-apple hover:text-primary transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {privateProjects.length > 0 && (
          <div>
            <motion.h3
              className="text-3xl font-bold mb-12 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center shadow-apple">
                <span className="text-2xl">💼</span>
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Client Projects
              </span>
            </motion.h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {privateProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="group relative h-full"
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: (openSourceProjects.length * 0.15) + (index * 0.15),
                    type: 'spring',
                    stiffness: 100
                  }}
                  whileHover={{ y: -8 }}
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                  <div className="relative glass hover:glass-strong p-8 rounded-3xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-500 h-full flex flex-col">
                    {project.featured && (
                      <motion.div
                        className="absolute top-6 right-6 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 text-xs font-bold rounded-xl shadow-apple"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, type: 'spring' }}
                      >
                        ⭐ Featured
                      </motion.div>
                    )}

                    <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-accent transition-all duration-300">
                      {project.name}
                    </h4>
                    <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                      {project.description}
                    </p>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-6 border-t border-white/10">
                        {project.technologies.map((tech) => (
                          <motion.span
                            key={tech}
                            className="px-3 py-1.5 glass-subtle hover:glass rounded-xl text-xs font-semibold shadow-apple hover:text-primary transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
