'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { JSONResume } from '@/types/json-resume';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { TabNavigation } from './TabNavigation';
import { SkillsSection } from './sections/SkillsSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { PersonalSection } from './sections/PersonalSection';

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
  const targetRoles = resume._custom?.targetRoles
    ? Object.entries(resume._custom.targetRoles)
    : [];
  const keyAchievements = resume._custom?.keyAchievements ?? [];
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

  const metricCards = useMemo(
    () =>
      [
        quantifiable?.yearsExperience && {
          label: 'Years shipping',
          value: `${quantifiable.yearsExperience}+`,
          caption: 'Production web applications',
        },
        quantifiable?.teamsLed && {
          label: 'Teams led',
          value: `${quantifiable.teamsLed}`,
          caption: 'Across startups, agencies, enterprise',
        },
        quantifiable?.remoteYears && {
          label: 'Remote-first',
          value: `${quantifiable.remoteYears}+ yrs`,
          caption: 'Async collaboration across time zones',
        },
        resume.work?.[0]?.position && {
          label: 'Latest role',
          value: resume.work[0].position,
          caption: resume.work[0].name ?? '',
        },
      ].filter((metric): metric is { label: string; value: string; caption?: string } => Boolean(metric)),
    [quantifiable?.remoteYears, quantifiable?.teamsLed, quantifiable?.yearsExperience, resume.work]
  );
  const hasMetrics = metricCards.length > 0;

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

  const summarySection = showSummary ? (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-500/15 via-sky-500/10 to-transparent p-6 shadow-apple-lg">
      <div
        className="absolute inset-y-0 right-0 w-1/3 rounded-3xl bg-gradient-to-l from-white/5 to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-200/90">
            Snapshot
          </p>
          <p className="mt-3 text-base text-zinc-100/90">{resume.basics?.summary}</p>
        </div>
        {companyPreferences?.primary && (
          <div className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-zinc-200 shadow-apple md:w-auto">
            <p className="font-semibold text-white">Currently focused on</p>
            <p className="text-emerald-200">{companyPreferences.primary}</p>
            {companyPreferences.secondary && (
              <p className="text-xs text-zinc-400">Secondary: {companyPreferences.secondary}</p>
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
          className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-apple"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
            {metric.label}
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">{metric.value}</p>
          {metric.caption && <p className="mt-1 text-sm text-zinc-400">{metric.caption}</p>}
        </div>
      ))}
    </section>
  ) : null;

  const insightsSection =
    targetRoles.length > 0 ||
    (quantifiable?.companyTypes && quantifiable.companyTypes.length > 0) ||
    keyAchievements.length > 0 ? (
      <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 shadow-apple">
        <div className="grid gap-4 lg:grid-cols-2">
          {targetRoles.slice(0, 4).map(([roleKey, role]) => (
            <div
              key={roleKey}
              className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200"
            >
              <p className="font-semibold text-emerald-200">{role.label}</p>
              <p className="mt-1 text-xs text-zinc-400">{role.summaryFocus}</p>
            </div>
          ))}

          {quantifiable?.companyTypes && quantifiable.companyTypes.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">
              <p className="font-semibold text-emerald-200">Company types</p>
              <p className="mt-1 text-xs text-zinc-400">{quantifiable.companyTypes.join(' • ')}</p>
            </div>
          )}

          {keyAchievements.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 lg:col-span-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                Highlights
              </p>
              <ul className="mt-3 space-y-1 text-sm text-zinc-300">
                {keyAchievements.slice(0, 3).map((achievement) => (
                  <li key={achievement} className="flex items-start gap-2">
                    <span className="text-emerald-300">•</span>
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
      <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-apple">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
            ✦
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Thought leadership</p>
            <h2 className="text-xl font-semibold text-white">Publications</h2>
          </div>
        </div>
        <div className="space-y-4">
          {resume.publications.map((pub, index) => (
            <article
              key={`${pub.name ?? 'publication'}-${index}`}
              className="rounded-3xl border border-white/10 bg-black/30 p-5 text-sm text-zinc-200"
            >
              {pub.name && <h3 className="text-lg font-semibold text-white">{pub.name}</h3>}
              {pub.publisher && <p className="text-emerald-200 text-xs">{pub.publisher}</p>}
              {pub.summary && <p className="mt-2 text-zinc-300">{pub.summary}</p>}
            </article>
          ))}
        </div>
      </section>
    ) : null;

  const scrollToSection = useCallback(
    (id: FullSectionId) => {
      const target = sectionRefs.current[id];
      if (!target) return;
      const offset = 120;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    },
    []
  );

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
          .filter((entry) => entry.isIntersecting && entry.target.dataset.sectionId)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (sorted.length > 0) {
          const nextId = sorted[0].target.dataset.sectionId as FullSectionId;
          if (nextId && nextId !== activeSection) {
            setActiveSection(nextId);
          }
          return;
        }

        const fallback = entries.find(
          (entry) => entry.boundingClientRect.top >= 0 && entry.target.dataset.sectionId
        );
        if (fallback) {
          const nextId = fallback.target.dataset.sectionId as FullSectionId;
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

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [activeTab, activeSection, availableSections]);

  return (
    <div className="relative min-h-screen px-4 pb-16 pt-6 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-5xl">
        <Header basics={resume.basics} />

        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'full' && availableSections.length > 0 && (
          <div className="sticky top-4 z-40 mb-6">
            <div className="rounded-3xl border border-white/10 bg-black/40 p-4 shadow-apple backdrop-blur">
              <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.4em] text-emerald-200/80">
                <span>{sectionLabels[activeSection]}</span>
                <span className="tracking-normal text-white">{Math.round(fullViewProgress)}%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-[width]"
                  style={{ width: `${fullViewProgress}%` }}
                />
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {availableSections.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => scrollToSection(id)}
                    className={cn(
                      'rounded-2xl px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60',
                      activeSection === id
                        ? 'bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-apple'
                        : 'text-zinc-400 hover:text-white'
                    )}
                  >
                    {sectionLabels[id]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {summarySection && wrapSection('summary', summarySection)}
          {metricsSection && wrapSection('metrics', metricsSection)}
          {insightsSection}
        </div>

        {(activeTab === 'full' || activeTab === 'skills') && hasSkills && wrapSection(
          'skills',
          <SkillsSection skills={resume.skills!} />
        )}

        {(activeTab === 'full' || activeTab === 'experience') && hasExperience && wrapSection(
          'experience',
          <ExperienceSection work={resume.work!} formatDate={formatDate} />
        )}

        {(activeTab === 'full' || activeTab === 'projects') && hasProjects && wrapSection(
          'projects',
          <ProjectsSection projects={resume.projects!} />
        )}

        {publicationsSection && wrapSection('publications', publicationsSection)}

        {(activeTab === 'full' || activeTab === 'personal') && hasPersonal && wrapSection(
          'personal',
          <PersonalSection
            volunteer={resume.volunteer}
            interests={resume.interests}
            education={resume.education}
            languages={resume.languages}
            certificates={resume.certificates}
            formatDate={formatDate}
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

