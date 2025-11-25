'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useResumeHighlight } from '@/hooks/useResumeHighlight';
import { cn } from '@/lib/utils';
import type { JSONResume } from '@/types/json-resume';
import { Header } from './Header';
import { ExperienceSection } from './sections/ExperienceSection';
import { PersonalSection } from './sections/PersonalSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';
import { TabNavigation } from './TabNavigation';

type TabType = 'full' | 'experience' | 'skills' | 'projects' | 'personal';
type FullSectionId =
  | 'summary'
  | 'metrics'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'publications'
  | 'personal';

const fullSectionOrder: FullSectionId[] = [
  'summary',
  'metrics',
  'skills',
  'experience',
  'projects',
  'publications',
  'personal',
];

const sectionLabels: Record<FullSectionId, string> = {
  summary: 'Snapshot',
  metrics: 'Metrics',
  skills: 'Skills',
  experience: 'Experience',
  projects: 'Projects',
  publications: 'Publications',
  personal: 'Personal',
};

interface ResumeLayoutProps {
  resume: JSONResume;
}

export function ResumeLayout({ resume }: ResumeLayoutProps) {
  const [activeTab, setActiveTab] = useState<TabType>('full');
  const [activeSection, setActiveSection] = useState<FullSectionId>('summary');
  const [fullViewProgress, setFullViewProgress] = useState(0);
  const sectionRefs = useRef<Record<FullSectionId, HTMLElement | null>>({
    summary: null,
    metrics: null,
    skills: null,
    experience: null,
    projects: null,
    publications: null,
    personal: null,
  });

  const { isHighlighted } = useResumeHighlight();

  const formatDate = (date?: string) => {
    if (!date) return 'Present';
    const [year, month] = date.split('-');
    if (!year) return 'Present';
    const parsedMonth = month ? Number.parseInt(month, 10) - 1 : 0;
    const parsedDate = new Date(Number(year), Number.isNaN(parsedMonth) ? 0 : parsedMonth);
    return parsedDate.toLocaleString('en', { month: month ? 'short' : undefined, year: 'numeric' });
  };

  const quantifiable = resume._custom?.quantifiableMetrics;
  const companyPreferences = resume._custom?.companyPreferences;
  const targetRoles = resume._custom?.targetRoles ? Object.entries(resume._custom.targetRoles) : [];
  const keyAchievements = resume._custom?.keyAchievements ?? [];
  const _basicsLocation = resume.basics?.location
    ? `${resume.basics.location.city || ''}${
        resume.basics.location.city && resume.basics.location.countryCode ? ', ' : ''
      }${resume.basics.location.countryCode || ''}`
    : '';
  const showSummary = Boolean(
    resume.basics?.summary && (activeTab === 'full' || activeTab === 'experience')
  );
  const hasSkills = Boolean(resume.skills && resume.skills.length > 0);
  const hasExperience = Boolean(resume.work && resume.work.length > 0);
  const hasProjects = Boolean(resume.projects && resume.projects.length > 0);
  const hasPublications = Boolean(resume.publications && resume.publications.length > 0);
  const hasPersonal =
    Boolean(resume.volunteer?.length) ||
    Boolean(resume.interests?.length) ||
    Boolean(resume.education?.length) ||
    Boolean(resume.languages?.length) ||
    Boolean(resume.certificates?.length);

  const metricCards = useMemo(() => {
    const metrics: (
      | { label: string; value: string; caption?: string }
      | undefined
      | false
      | 0
      | null
    )[] = [
      quantifiable?.yearsExperience
        ? {
            label: 'Years shipping',
            value: `${quantifiable.yearsExperience}+`,
            caption: 'Production web applications',
          }
        : undefined,
      quantifiable?.teamsLed
        ? {
            label: 'Teams led',
            value: `${quantifiable.teamsLed}`,
            caption: 'Across startups, agencies, enterprise',
          }
        : undefined,
      quantifiable?.remoteYears
        ? {
            label: 'Remote-first',
            value: `${quantifiable.remoteYears}+ yrs`,
            caption: 'Async collaboration across time zones',
          }
        : undefined,
      resume.work?.[0]?.position
        ? {
            label: 'Latest role',
            value: resume.work[0].position,
            caption: resume.work[0].name ?? '',
          }
        : undefined,
    ];

    return metrics.filter((metric): metric is { label: string; value: string; caption?: string } =>
      Boolean(metric)
    );
  }, [
    quantifiable?.remoteYears,
    quantifiable?.teamsLed,
    quantifiable?.yearsExperience,
    resume.work,
  ]);
  const hasMetrics = metricCards.length > 0;

  const availableSections = useMemo(
    () =>
      fullSectionOrder.filter((id) => {
        switch (id) {
          case 'summary':
            return showSummary;
          case 'metrics':
            return hasMetrics;
          case 'skills':
            return hasSkills;
          case 'experience':
            return hasExperience;
          case 'projects':
            return hasProjects;
          case 'publications':
            return hasPublications;
          case 'personal':
            return hasPersonal;
          default:
            return false;
        }
      }),
    [showSummary, hasMetrics, hasSkills, hasExperience, hasProjects, hasPublications, hasPersonal]
  );

  const showStickyContext = activeTab === 'full' && availableSections.length > 0;

  const setSectionRef = useCallback(
    (id: FullSectionId) => (node: HTMLElement | null) => {
      sectionRefs.current[id] = node;
      if (node) {
        node.setAttribute('data-section-id', id);
      }
    },
    []
  );

  const wrapSection = useCallback(
    (id: FullSectionId, content: ReactNode) => {
      if (activeTab !== 'full') {
        return content;
      }
      return (
        <div id={id} ref={setSectionRef(id)}>
          {content}
        </div>
      );
    },
    [activeTab, setSectionRef]
  );

  const summarySection = showSummary ? (
    <section className="interactive-card relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/20 via-accent/12 to-transparent p-6 shadow-apple-lg dark:border-white/10 dark:from-[#ff47c0]/20 dark:via-[#45caff]/12">
      <div
        className="absolute inset-y-0 right-0 w-1/3 rounded-3xl bg-gradient-to-l from-white/5 to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary dark:text-[#f6a7ff]">
            Snapshot
          </p>
          <p className="mt-3 text-base text-foreground/90 dark:text-zinc-100/90">
            {resume.basics?.summary}
          </p>
        </div>
        {companyPreferences?.primary && (
          <div className="w-full rounded-2xl border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground shadow-apple md:w-auto dark:border-white/15 dark:bg-black/40 dark:text-zinc-200">
            <p className="font-semibold text-foreground dark:text-white">Currently focused on</p>
            <p className="text-primary dark:text-[#f6a7ff]">{companyPreferences.primary}</p>
            {companyPreferences.secondary && (
              <p className="text-xs text-muted-foreground/80 dark:text-zinc-400">
                Secondary: {companyPreferences.secondary}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  ) : null;

  const metricsSection = hasMetrics ? (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metricCards.map((metric) => (
        <div
          key={metric.label}
          className="interactive-card rounded-3xl border border-border bg-card/50 p-5 shadow-apple dark:border-white/10 dark:bg-white/[0.04]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary dark:text-[#f6a7ff]">
            {metric.label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-foreground dark:text-white">
            {metric.value}
          </p>
          {metric.caption && (
            <p className="mt-1 text-sm text-muted-foreground dark:text-zinc-400">
              {metric.caption}
            </p>
          )}
        </div>
      ))}
    </section>
  ) : null;

  const insightsSection =
    targetRoles.length > 0 ||
    (quantifiable?.companyTypes && quantifiable.companyTypes.length > 0) ||
    keyAchievements.length > 0 ? (
      <section className="interactive-card rounded-3xl border border-border bg-card/50 p-6 shadow-apple dark:border-white/10 dark:bg-white/[0.02]">
        <div className="grid gap-4 lg:grid-cols-2">
          {targetRoles.slice(0, 4).map(([roleKey, role]) => (
            <div
              key={roleKey}
              className="hover-lift rounded-2xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground dark:border-white/10 dark:bg-black/30 dark:text-zinc-200"
            >
              <p className="font-semibold text-primary dark:text-[#f6a7ff]">{role.label}</p>
              <p className="mt-1 text-xs text-muted-foreground/80 dark:text-zinc-400">
                {role.summaryFocus}
              </p>
            </div>
          ))}

          {quantifiable?.companyTypes && quantifiable.companyTypes.length > 0 && (
            <div className="hover-lift rounded-2xl border border-border bg-secondary/30 p-4 text-sm text-muted-foreground dark:border-white/10 dark:bg-black/30 dark:text-zinc-200">
              <p className="font-semibold text-primary dark:text-[#f6a7ff]">Company types</p>
              <p className="mt-1 text-xs text-muted-foreground/80 dark:text-zinc-400">
                {quantifiable.companyTypes.join(' • ')}
              </p>
            </div>
          )}

          {keyAchievements.length > 0 && (
            <div className="hover-lift rounded-2xl border border-border bg-secondary/30 p-4 lg:col-span-2 dark:border-white/10 dark:bg-black/30">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary dark:text-[#f6a7ff]">
                Highlights
              </p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground dark:text-zinc-300">
                {keyAchievements.slice(0, 3).map((achievement) => (
                  <li key={achievement} className="flex items-start gap-2">
                    <span className="text-accent dark:text-[#45caff]">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    ) : null;

  const publicationsSection =
    (activeTab === 'full' || activeTab === 'projects') && hasPublications ? (
      <section className="interactive-card mb-12 rounded-3xl border border-border bg-card/50 p-6 shadow-apple dark:border-white/10 dark:bg-white/[0.03]">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-accent dark:bg-[#ff47c0]/15 dark:text-[#45caff]">
            ✦
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary/80 dark:text-[#f6a7ff]/80">
              Thought leadership
            </p>
            <h2 className="text-xl font-semibold text-foreground dark:text-white">Publications</h2>
          </div>
        </div>
        <div className="space-y-4">
          {(resume.publications || []).map((pub, index) => (
            <article
              key={`${pub.name ?? 'publication'}-${index}`}
              className="hover-lift rounded-3xl border border-border bg-secondary/30 p-5 text-sm text-muted-foreground dark:border-white/10 dark:bg-black/30 dark:text-zinc-200"
            >
              {pub.name && (
                <h3 className="text-lg font-semibold text-foreground dark:text-white">
                  {pub.name}
                </h3>
              )}
              {pub.publisher && (
                <p className="text-accent text-xs dark:text-[#45caff]">{pub.publisher}</p>
              )}
              {pub.summary && (
                <p className="mt-2 text-muted-foreground dark:text-zinc-300">{pub.summary}</p>
              )}
            </article>
          ))}
        </div>
      </section>
    ) : null;

  const scrollToSection = useCallback((id: FullSectionId) => {
    const target = sectionRefs.current[id];
    if (!target) return;
    const offset = 120;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (activeTab !== 'full' || typeof window === 'undefined') {
      return;
    }
    const handleScroll = () => {
      const { documentElement } = document;
      const total = documentElement.scrollHeight - documentElement.clientHeight;
      const progress = total > 0 ? (documentElement.scrollTop / total) * 100 : 0;
      setFullViewProgress(Math.min(Math.max(progress, 0), 100));
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'full' || availableSections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const sorted = entries
          .filter(
            (entry) => entry.isIntersecting && (entry.target as HTMLElement).dataset.sectionId
          )
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (sorted.length > 0) {
          const nextId = (sorted[0].target as HTMLElement).dataset.sectionId as FullSectionId;
          if (nextId && nextId !== activeSection) {
            setActiveSection(nextId);
          }
          return;
        }

        const fallback = entries.find(
          (entry) =>
            entry.boundingClientRect.top >= 0 && (entry.target as HTMLElement).dataset.sectionId
        );
        if (fallback) {
          const nextId = (fallback.target as HTMLElement).dataset.sectionId as FullSectionId;
          if (nextId && nextId !== activeSection) {
            setActiveSection(nextId);
          }
        }
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const elements = availableSections
      .map((id) => sectionRefs.current[id])
      .filter((el): el is HTMLElement => Boolean(el));

    for (const el of elements) {
      observer.observe(el);
    }

    return () => {
      for (const el of elements) {
        observer.unobserve(el);
      }
      observer.disconnect();
    };
  }, [activeTab, activeSection, availableSections]);

  return (
    <div className="relative min-h-screen px-4 pb-16 pt-6 text-foreground md:px-8 dark:text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <Header basics={resume.basics} />

        <div
          className={cn(
            'sticky top-20 z-40 -mx-4 md:-mx-8 px-4 md:px-8',
            showStickyContext && 'pb-4'
          )}
        >
          <div
            className={cn(
              'mx-auto max-w-5xl rounded-3xl border border-border bg-card/90 px-4 shadow-apple backdrop-blur supports-[backdrop-filter]:bg-card/70 dark:border-white/10 dark:bg-background/90 dark:supports-[backdrop-filter]:bg-background/70',
              showStickyContext ? 'py-4' : 'pt-4 pb-0'
            )}
          >
            <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

            {showStickyContext && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.4em] text-primary/80 dark:text-[#f6a7ff]/80">
                  <span>{sectionLabels[activeSection]}</span>
                  <span className="tracking-normal text-foreground dark:text-white">
                    {Math.round(fullViewProgress)}%
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary dark:bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-accent transition-[width] dark:from-[#ff47c0] dark:via-[#b04bff] dark:to-[#45caff]"
                    style={{ width: `${fullViewProgress}%` }}
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {availableSections.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => scrollToSection(id)}
                      className={cn(
                        'rounded-2xl px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 dark:focus-visible:ring-[#ff47c0]/60',
                        activeSection === id
                          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-apple dark:from-[#ff47c0] dark:to-[#45caff]'
                          : 'text-muted-foreground hover:text-foreground dark:text-zinc-400 dark:hover:text-white'
                      )}
                    >
                      {sectionLabels[id]}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {summarySection && wrapSection('summary', summarySection)}
          {metricsSection && wrapSection('metrics', metricsSection)}
          {insightsSection}
        </div>

        {(activeTab === 'full' || activeTab === 'skills') &&
          hasSkills &&
          wrapSection(
            'skills',
            <SkillsSection skills={resume.skills ?? []} highlighted={isHighlighted('skills')} />
          )}

        {(activeTab === 'full' || activeTab === 'experience') &&
          hasExperience &&
          wrapSection(
            'experience',
            <ExperienceSection
              work={resume.work ?? []}
              formatDate={formatDate}
              highlighted={isHighlighted('experience')}
            />
          )}

        {(activeTab === 'full' || activeTab === 'projects') &&
          hasProjects &&
          wrapSection(
            'projects',
            <ProjectsSection
              projects={resume.projects ?? []}
              highlighted={isHighlighted('projects')}
            />
          )}

        {publicationsSection && wrapSection('publications', publicationsSection)}

        {(activeTab === 'full' || activeTab === 'personal') &&
          hasPersonal &&
          wrapSection(
            'personal',
            <PersonalSection
              volunteer={resume.volunteer}
              interests={resume.interests}
              education={resume.education}
              languages={resume.languages}
              certificates={resume.certificates}
              formatDate={formatDate}
              highlighted={isHighlighted('personal')}
            />
          )}

        <footer className="mt-12 border-t border-white/10 pt-4 text-center text-sm text-zinc-500">
          {resume.meta?.version && `JSON Resume ${resume.meta.version}`}
          {resume.meta?.lastModified && ` · Last updated ${resume.meta.lastModified}`}
        </footer>
      </div>
    </div>
  );
}
