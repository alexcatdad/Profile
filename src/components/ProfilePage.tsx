import type { Dictionary } from '@/app/dictionaries/en';
import type { JSONResume } from '@/types/json-resume';
import { DownloadButtons } from './DownloadButtons';
import { Navigation } from './Navigation';
import { ResumeChat } from './ResumeChat';
import { ResumeLayout } from './ResumeLayout';

interface ProfilePageProps {
  resume: JSONResume;
  dictionary: Dictionary;
}

export function ProfilePage({ resume, dictionary }: ProfilePageProps) {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none absolute inset-0 neo-grid opacity-50"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 neo-noise" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[780px] w-[780px] -translate-x-1/2 neo-orb"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/4 right-[-10%] h-[420px] w-[420px] neo-orb opacity-70"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 neo-scanline" aria-hidden="true" />
      <div className="relative z-10 space-y-6">
        <Navigation dictionary={dictionary} />

        <main aria-label="Resume content">
          <ResumeLayout resume={resume} />
        </main>
        {/* <CoverLetterModalWrapper
          initialOpen={coverLetterOpen}
          resume={resume}
          dictionary={dictionary}
        /> */}
      </div>
      <DownloadButtons
        basics={resume.basics}
        targetRoles={resume._custom?.targetRoles}
        alignment="left"
      />
      <ResumeChat resume={resume} />
    </div>
  );
}
