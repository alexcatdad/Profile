import { BriefcaseBusiness } from 'lucide-react';
import type { Work } from '@/types/json-resume';

interface ExperienceSectionProps {
  work: Work[];
  formatDate: (date?: string) => string;
}

const parseDate = (date?: string) => {
  if (!date) return null;
  const [year, month = '01'] = date.split('-');
  return new Date(Number(year), Number(month) - 1 || 0);
};

const getDuration = (start?: string, end?: string) => {
  const startDate = parseDate(start);
  if (!startDate) return null;
  const endDate = parseDate(end) ?? new Date();
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  if (years <= 0 && remainder <= 0) return null;
  return `${years > 0 ? `${years}y ` : ''}${remainder > 0 ? `${remainder}m` : ''}`.trim();
};

export function ExperienceSection({ work, formatDate }: ExperienceSectionProps) {
  return (
    <section className="mb-12" aria-label="Experience timeline">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
          <BriefcaseBusiness className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/80">
            Experience
          </p>
          <h2 className="text-2xl font-semibold text-white">Impact timeline</h2>
        </div>
      </div>
      <div className="relative ps-6 before:absolute before:left-3 before:top-3 before:h-[calc(100%-12px)] before:w-px before:bg-gradient-to-b before:from-emerald-400/60 before:via-white/10 before:to-transparent">
        {work.map((job) => (
          <article
            key={`${job.name}-${job.position}-${job.startDate}`}
            className="relative mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-apple"
          >
            <span className="absolute -left-1 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500/20 text-xs font-semibold text-emerald-200">
              {job.name?.[0] ?? '•'}
            </span>
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                {job.position && <h3 className="text-lg font-semibold text-white">{job.position}</h3>}
                {job.name && <p className="text-sm text-emerald-300">{job.name}</p>}
              </div>
              <div className="text-sm text-zinc-400">
                <p>
                  {formatDate(job.startDate)} — {formatDate(job.endDate)}
                </p>
                {getDuration(job.startDate, job.endDate) && (
                  <p className="text-xs text-zinc-500">{getDuration(job.startDate, job.endDate)}</p>
                )}
                {job.teamSize && (
                  <p className="mt-1 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300">
                    Team: {job.teamSize}
                  </p>
                )}
              </div>
            </div>
            {job.summary && (
              <p className="mt-3 text-sm text-zinc-300">{job.summary}</p>
            )}
            {job.highlights && job.highlights.length > 0 && (
              <ul className="mt-4 space-y-2 text-sm text-zinc-200">
                {job.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2">
                    <span className="mt-1 text-emerald-300">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
            {job.keywords && job.keywords.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {job.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-zinc-300"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
