import type { Dictionary } from '@/app/dictionaries/en';
import type { JSONResume } from '@/types/json-resume';
import { ResumeLayout } from './ResumeLayout';
import { DownloadButtons } from './DownloadButtons';
import { ScrollProgress } from './ScrollProgress';
import { CoverLetterModalWrapper } from './CoverLetterModalWrapper';

interface ProfilePageProps {
  resume: JSONResume;
  dictionary: Dictionary;
  coverLetterOpen?: boolean;
}

export function ProfilePage({ resume, dictionary, coverLetterOpen = false }: ProfilePageProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <ScrollProgress />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(56,189,248,0.18),_transparent_55%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-grid-overlay opacity-15" aria-hidden="true" />
      <div
        className="pointer-events-none absolute inset-x-0 top-[-30%] h-[520px] bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent blur-3xl"
        aria-hidden="true"
      />
      <div className="relative z-10">
        <DownloadButtons basics={resume.basics} targetRoles={resume._custom?.targetRoles} />
        <main aria-label="Resume content">
          <ResumeLayout resume={resume} />
        </main>
        <CoverLetterModalWrapper
          initialOpen={coverLetterOpen}
          resume={resume}
          dictionary={dictionary}
        />
      </div>
    </div>
  );
}
