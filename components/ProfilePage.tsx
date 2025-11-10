import type { Dictionary } from '@/app/dictionaries/en';
import type { ContentData } from '@/types/content';
import { CoverLetterModalWrapper } from './CoverLetterModalWrapper';
import { Navigation } from './Navigation';
import { ScrollProgress } from './ScrollProgress';
import { ContactSection } from './sections/ContactSection';
import { EducationSection } from './sections/EducationSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { HeroSection } from './sections/HeroSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';
import { SummarySection } from './sections/SummarySection';

interface ProfilePageProps {
  content: ContentData;
  dictionary: Dictionary;
  coverLetterOpen?: boolean;
}

export function ProfilePage({ content, dictionary, coverLetterOpen = false }: ProfilePageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <Navigation dictionary={dictionary} />
      <main>
        <HeroSection profile={content.profile} dictionary={dictionary} />
        <SummarySection profile={content.profile} experience={content.experience} />
        <SkillsSection
          skills={content.skills}
          experience={content.experience}
          dictionary={dictionary}
        />
        <ExperienceSection experience={content.experience} dictionary={dictionary} />
        <ProjectsSection projects={content.projects} dictionary={dictionary} />
        <EducationSection
          education={content.education}
          certifications={content.certifications}
          dictionary={dictionary}
        />
        <ContactSection profile={content.profile} dictionary={dictionary} />
      </main>
      <CoverLetterModalWrapper
        initialOpen={coverLetterOpen}
        template={content.coverLetterTemplate}
        dictionary={dictionary}
      />
    </div>
  );
}
