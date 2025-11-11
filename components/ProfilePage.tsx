import type { Dictionary } from '@/app/dictionaries/en';
import type { ContentData } from '@/types/content';
import { CoverLetterModalWrapper } from './CoverLetterModalWrapper';
import { Navigation } from './Navigation';
import { ScrollProgress } from './ScrollProgress';
import { DownloadButtons } from './DownloadButtons';
import { ContactSection } from './sections/ContactSection';
import { EducationSection } from './sections/EducationSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { HeroSection } from './sections/HeroSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { SkillsSection } from './sections/SkillsSection';
import { SummarySection } from './sections/SummarySection';
import { MetricsSection } from './sections/MetricsSection';
import { AchievementsSection } from './sections/AchievementsSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { AwardsSection } from './sections/AwardsSection';
import { PublicationsSection } from './sections/PublicationsSection';

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
      <DownloadButtons />
      <main role="main" aria-label="Profile content">
        <HeroSection profile={content.profile} dictionary={dictionary} />
        <SummarySection profile={content.profile} experience={content.experience} />

        {/* Metrics Dashboard - Showcase key statistics */}
        {content.metrics && content.metrics.length > 0 && (
          <MetricsSection metrics={content.metrics} />
        )}

        <SkillsSection
          skills={content.skills}
          experience={content.experience}
          dictionary={dictionary}
        />

        {/* Key Achievements */}
        {content.achievements && content.achievements.length > 0 && (
          <AchievementsSection achievements={content.achievements} />
        )}

        <ExperienceSection experience={content.experience} dictionary={dictionary} />
        <ProjectsSection projects={content.projects} dictionary={dictionary} />

        {/* Publications */}
        {content.publications && content.publications.length > 0 && (
          <PublicationsSection publications={content.publications} />
        )}

        {/* Testimonials */}
        {content.testimonials && content.testimonials.length > 0 && (
          <TestimonialsSection testimonials={content.testimonials} />
        )}

        {/* Awards */}
        {content.awards && content.awards.length > 0 && (
          <AwardsSection awards={content.awards} />
        )}

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
