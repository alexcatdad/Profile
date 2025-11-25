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
  yearsOfExperience?: number;
  proficiency?: number; // 0-100
  lastUsed?: string; // YYYY-MM format
  highlighted?: boolean;
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
  achievements?: Achievement[];
  teamSize?: number;
  companyWebsite?: string;
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

export interface Achievement {
  id: string;
  title: string;
  description: string;
  metric?: {
    value: string | number;
    label: string;
  };
  date?: string;
  icon?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  relationship: string; // e.g., "Manager at Tech Corp", "Colleague", "Client"
  text: string;
  avatar?: string;
  linkedinUrl?: string;
  date?: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  icon?: string;
  url?: string;
}

export interface Publication {
  id: string;
  title: string;
  type: 'article' | 'talk' | 'podcast' | 'video' | 'book';
  publisher: string;
  date: string;
  url?: string;
  description?: string;
  views?: number;
  likes?: number;
}

export interface Metric {
  id: string;
  label: string;
  value: string | number;
  suffix?: string;
  prefix?: string;
  description?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ContentData {
  profile: Profile;
  skills: Skill[];
  experience: WorkExperience[];
  projects: Project[];
  education: Education[];
  certifications: Certification[];
  coverLetterTemplate: CoverLetterTemplate;
  achievements?: Achievement[];
  testimonials?: Testimonial[];
  awards?: Award[];
  publications?: Publication[];
  metrics?: Metric[];
}
