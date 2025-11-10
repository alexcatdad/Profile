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
    <section id="projects" ref={ref} className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {dictionary.navigation.projects}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        {openSourceProjects.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 text-foreground flex items-center gap-2">
              <Github className="w-6 h-6 text-primary" />
              Open Source
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openSourceProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="group bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/50 relative overflow-hidden"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  {project.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 text-xs font-bold rounded-full shadow-md">
                      ⭐ Featured
                    </div>
                  )}

                  <h4 className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-4 mb-4">
                    {project.stars !== undefined && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">
                          <AnimatedCounter target={project.stars} isInView={isInView} />
                        </span>
                      </div>
                    )}
                    {project.downloads !== undefined && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Download className="w-4 h-4" />
                        <span className="font-semibold">
                          <AnimatedCounter target={project.downloads} isInView={isInView} />
                        </span>
                      </div>
                    )}
                  </div>

                  {project.githubUrl && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full mt-4 px-4 py-2.5 bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 group/link"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Github className="w-4 h-4" />
                      <span>View on GitHub</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </motion.a>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20 hover:border-primary/50 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {privateProjects.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold mb-8 text-foreground flex items-center gap-2">
              <span className="text-xl">💼</span>
              Client Projects
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {privateProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="group bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/50 relative overflow-hidden"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: (openSourceProjects.length + index) * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  {project.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-950 text-xs font-bold rounded-full shadow-md">
                      ⭐ Featured
                    </div>
                  )}

                  <h4 className="text-xl font-bold mb-2 text-card-foreground group-hover:text-primary transition-colors">
                    {project.name}
                  </h4>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium border border-primary/20 hover:border-primary/50 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
