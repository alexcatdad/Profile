import { Code2 } from 'lucide-react';
import type { Project } from '@/types/json-resume';

interface ProjectsSectionProps {
  projects: Project[];
  highlighted?: boolean;
}

export function ProjectsSection({ projects, highlighted = false }: ProjectsSectionProps) {
  return (
    <section
      className="mb-12"
      aria-label="Projects"
      data-resume-section="projects"
      data-highlighted={highlighted}
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-accent">
          <Code2 className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary/80">
            Projects
          </p>
          <h2 className="text-2xl font-semibold text-foreground dark:text-white">Selected work</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <article
            key={`${project.name ?? 'project'}-${index}`}
            className="interactive-card flex h-full flex-col rounded-3xl border border-border bg-card/50 p-5 text-sm text-foreground/90 shadow-apple dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-200"
          >
            {project.name && <h3 className="text-xl font-semibold text-foreground dark:text-white">{project.name}</h3>}
            {project.description && (
              <p className="mt-2 text-sm text-muted-foreground dark:text-zinc-400">{project.description}</p>
            )}
            {project.highlights && project.highlights.length > 0 && (
              <ul className="mt-3 space-y-2 text-xs text-muted-foreground dark:text-zinc-300">
                {project.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-0.5 text-accent">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
            {project.keywords && project.keywords.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {project.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs text-primary dark:border-white/10 dark:bg-black/30 dark:text-[#f6a7ff]"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="link-pulse mt-4 text-xs font-semibold text-accent"
              >
                View project
                <span aria-hidden="true">↗</span>
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
