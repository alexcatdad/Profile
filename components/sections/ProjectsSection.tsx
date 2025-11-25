import { Code2 } from 'lucide-react';
import type { Project } from '@/types/json-resume';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section className="mb-12" aria-label="Projects">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ff47c0]/15 text-[#45caff]">
          <Code2 className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f6a7ff]/80">
            Projects
          </p>
          <h2 className="text-2xl font-semibold text-white">Selected work</h2>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project, index) => (
          <article
            key={`${project.name ?? 'project'}-${index}`}
            className="interactive-card flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5 text-sm text-zinc-200 shadow-apple"
          >
            {project.name && <h3 className="text-xl font-semibold text-white">{project.name}</h3>}
            {project.description && (
              <p className="mt-2 text-sm text-zinc-400">{project.description}</p>
            )}
            {project.highlights && project.highlights.length > 0 && (
              <ul className="mt-3 space-y-2 text-xs text-zinc-300">
                {project.highlights.slice(0, 3).map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-0.5 text-[#45caff]">•</span>
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
                    className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-[#f6a7ff]"
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
                className="link-pulse mt-4 text-xs font-semibold text-[#45caff]"
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
