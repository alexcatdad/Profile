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

const ContentDataSchema = z.object({
  profile: ProfileSchema,
  skills: z.array(SkillSchema),
  experience: z.array(WorkExperienceSchema),
  projects: z.array(ProjectSchema),
  education: z.array(EducationSchema),
  certifications: z.array(CertificationSchema),
  coverLetterTemplate: CoverLetterTemplateSchema,
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

    const content: ContentData = {
      profile: profileData.default as Profile,
      skills: skillsData.default as Skill[],
      experience: experienceData.default as WorkExperience[],
      projects: projectsData.default as Project[],
      education: educationData.default as Education[],
      certifications: certificationsData.default as Certification[],
      coverLetterTemplate: coverLetterData.default as CoverLetterTemplate,
    };

    // Runtime validation
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
