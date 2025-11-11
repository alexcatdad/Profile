import { z } from 'zod';
import type {
  Certification,
  ContentData,
  CoverLetterTemplate,
  Education,
  Profile,
  Project,
  Skill,
  WorkExperience,
} from '@/types/content';

// Zod schemas for runtime validation
const ProfileSchema = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string(),
  location: z.string(),
  summary: z.array(z.string()),
  yearsOfExperience: z.number(),
  headshot: z.string(),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string(),
  }),
  social: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
  }),
});

const SkillSchema = z.object({
  name: z.string(),
  category: z.string(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  yearsOfExperience: z.number().optional(),
  proficiency: z.number().min(0).max(100).optional(),
  lastUsed: z.string().optional(),
  highlighted: z.boolean().optional(),
});

const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  metric: z
    .object({
      value: z.union([z.string(), z.number()]),
      label: z.string(),
    })
    .optional(),
  date: z.string().optional(),
  icon: z.string().optional(),
});

const WorkExperienceSchema = z.object({
  id: z.string(),
  company: z.string(),
  position: z.string(),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  current: z.boolean(),
  description: z.array(z.string()),
  technologies: z.array(z.string()),
  logo: z.string().optional(),
  achievements: z.array(AchievementSchema).optional(),
  teamSize: z.number().optional(),
  companyWebsite: z.string().optional(),
});

const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  url: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  stars: z.number().optional(),
  npmPackage: z.string().optional(),
  downloads: z.number().optional(),
  featured: z.boolean(),
  technologies: z.array(z.string()),
  image: z.string().optional(),
  private: z.boolean().optional(),
  nda: z.boolean().optional(),
});

const EducationSchema = z.object({
  id: z.string(),
  institution: z.string(),
  degree: z.string(),
  field: z.string(),
  startDate: z.string(),
  endDate: z.string().nullable(),
  current: z.boolean(),
  logo: z.string().optional(),
});

const CertificationSchema = z.object({
  id: z.string(),
  name: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  url: z.string().url().optional(),
  logo: z.string().optional(),
});

const CoverLetterTemplateSchema = z.object({
  header: z.object({
    name: z.string(),
    title: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    location: z.string(),
    linkedin: z.string().url().optional(),
  }),
  date: z.string(),
  recipient: z.object({
    name: z.string(),
    company: z.string(),
    address: z.string().optional(),
    city: z.string().optional(),
  }),
  salutation: z.string(),
  paragraphs: z.object({
    introduction: z.string(),
    qualifications: z.string(),
    alignment: z.string(),
    closing: z.string(),
  }),
  signature: z.object({
    closing: z.string(),
    name: z.string(),
    title: z.string(),
  }),
});

const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  company: z.string(),
  relationship: z.string(),
  text: z.string(),
  avatar: z.string().optional(),
  linkedinUrl: z.string().url().optional(),
  date: z.string().optional(),
});

const AwardSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.string(),
  date: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  url: z.string().url().optional(),
});

const PublicationSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.enum(['article', 'talk', 'podcast', 'video', 'book']),
  publisher: z.string(),
  date: z.string(),
  url: z.string().url().optional(),
  description: z.string().optional(),
  views: z.number().optional(),
  likes: z.number().optional(),
});

const MetricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.union([z.string(), z.number()]),
  suffix: z.string().optional(),
  prefix: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  trend: z.enum(['up', 'down', 'neutral']).optional(),
});

const ContentDataSchema = z.object({
  profile: ProfileSchema,
  skills: z.array(SkillSchema),
  experience: z.array(WorkExperienceSchema),
  projects: z.array(ProjectSchema),
  education: z.array(EducationSchema),
  certifications: z.array(CertificationSchema),
  coverLetterTemplate: CoverLetterTemplateSchema,
  achievements: z.array(AchievementSchema).optional(),
  testimonials: z.array(TestimonialSchema).optional(),
  awards: z.array(AwardSchema).optional(),
  publications: z.array(PublicationSchema).optional(),
  metrics: z.array(MetricSchema).optional(),
});

export async function loadContent(): Promise<ContentData> {
  try {
    const profileData = await import('@/data/profile.json');
    const skillsData = await import('@/data/skills.json');
    const experienceData = await import('@/data/experience.json');
    const projectsData = await import('@/data/projects.json');
    const educationData = await import('@/data/education.json');
    const certificationsData = await import('@/data/certifications.json');
    const coverLetterData = await import('@/data/cover-letter-template.json');

    // Load optional new sections
    let achievementsData;
    let testimonialsData;
    let awardsData;
    let publicationsData;
    let metricsData;

    try {
      achievementsData = await import('@/data/achievements.json');
    } catch {
      achievementsData = null;
    }

    try {
      testimonialsData = await import('@/data/testimonials.json');
    } catch {
      testimonialsData = null;
    }

    try {
      awardsData = await import('@/data/awards.json');
    } catch {
      awardsData = null;
    }

    try {
      publicationsData = await import('@/data/publications.json');
    } catch {
      publicationsData = null;
    }

    try {
      metricsData = await import('@/data/metrics.json');
    } catch {
      metricsData = null;
    }

    const content = {
      profile: profileData.default,
      skills: skillsData.default,
      experience: experienceData.default,
      projects: projectsData.default,
      education: educationData.default,
      certifications: certificationsData.default,
      coverLetterTemplate: coverLetterData.default,
      ...(achievementsData && { achievements: achievementsData.default }),
      ...(testimonialsData && { testimonials: testimonialsData.default }),
      ...(awardsData && { awards: awardsData.default }),
      ...(publicationsData && { publications: publicationsData.default }),
      ...(metricsData && { metrics: metricsData.default }),
    };

    // Runtime validation - Zod will handle type coercion and validation
    const validated = ContentDataSchema.parse(content);
    return validated;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Content validation error:', error.issues);
      throw new Error(`Content validation failed: ${error.message}`);
    }
    throw error;
  }
}
