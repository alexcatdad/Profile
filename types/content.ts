export interface Profile {
  name: string;
  title: string;
  tagline: string;
  location: string;
  summary: string[];
  yearsOfExperience: number;
  headshot: string;
  contact: {
    email: string;
    phone?: string;
    location: string;
  };
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Skill {
  name: string;
  category: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string[];
  technologies: string[];
  logo?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  url?: string;
  githubUrl?: string;
  stars?: number;
  npmPackage?: string;
  downloads?: number;
  featured: boolean;
  technologies: string[];
  image?: string;
  private?: boolean;
  nda?: boolean;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  logo?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
  logo?: string;
}

export interface CoverLetterTemplate {
  header: {
    name: string;
    title: string;
    email: string;
    phone?: string;
    location: string;
    linkedin?: string;
  };
  date: string;
  recipient: {
    name: string;
    company: string;
    address?: string;
    city?: string;
  };
  salutation: string;
  paragraphs: {
    introduction: string;
    qualifications: string;
    alignment: string;
    closing: string;
  };
  signature: {
    closing: string;
    name: string;
    title: string;
  };
}

export interface ContentData {
  profile: Profile;
  skills: Skill[];
  experience: WorkExperience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  coverLetterTemplate: CoverLetterTemplate;
}
