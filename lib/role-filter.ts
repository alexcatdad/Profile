import type { ContentData, Skill, WorkExperience, Project } from '@/types/content';

export type RoleType = 'frontend' | 'backend' | 'fullstack' | 'devops' | 'mobile' | 'all';

interface RoleMapping {
  skills: string[];
  categories: string[];
  keywords: string[];
}

const roleMappings: Record<RoleType, RoleMapping> = {
  frontend: {
    skills: [
      'react',
      'vue',
      'angular',
      'next.js',
      'javascript',
      'typescript',
      'html',
      'css',
      'tailwind',
      'sass',
      'webpack',
      'vite',
    ],
    categories: ['frontend', 'languages'],
    keywords: ['ui', 'ux', 'component', 'responsive', 'design', 'interface'],
  },
  backend: {
    skills: [
      'node.js',
      'express',
      'nestjs',
      'python',
      'django',
      'flask',
      'go',
      'java',
      'spring',
      'graphql',
      'rest',
      'api',
    ],
    categories: ['backend', 'database', 'languages'],
    keywords: ['api', 'server', 'database', 'microservices', 'backend', 'endpoint'],
  },
  fullstack: {
    skills: [],
    categories: ['frontend', 'backend', 'database', 'languages'],
    keywords: ['full stack', 'fullstack', 'end-to-end', 'full-stack'],
  },
  devops: {
    skills: [
      'docker',
      'kubernetes',
      'aws',
      'azure',
      'gcp',
      'terraform',
      'ci/cd',
      'jenkins',
      'github actions',
    ],
    categories: ['devops', 'cloud'],
    keywords: ['devops', 'infrastructure', 'deployment', 'ci/cd', 'pipeline', 'cloud'],
  },
  mobile: {
    skills: ['react native', 'flutter', 'swift', 'kotlin', 'ios', 'android'],
    categories: ['mobile'],
    keywords: ['mobile', 'ios', 'android', 'app'],
  },
  all: {
    skills: [],
    categories: [],
    keywords: [],
  },
};

function matchesRole(text: string, role: RoleType): boolean {
  if (role === 'all') return true;

  const mapping = roleMappings[role];
  const lowerText = text.toLowerCase();

  return (
    mapping.skills.some((skill) => lowerText.includes(skill.toLowerCase())) ||
    mapping.keywords.some((keyword) => lowerText.includes(keyword))
  );
}

function filterSkills(skills: Skill[], role: RoleType): Skill[] {
  if (role === 'all') return skills;

  const mapping = roleMappings[role];

  return skills.filter((skill) => {
    // Match by category
    if (mapping.categories.some((cat) => skill.category.toLowerCase().includes(cat))) {
      return true;
    }

    // Match by skill name
    if (
      mapping.skills.some((s) => skill.name.toLowerCase().includes(s.toLowerCase()))
    ) {
      return true;
    }

    return false;
  });
}

function filterExperience(experience: WorkExperience[], role: RoleType): WorkExperience[] {
  if (role === 'all') return experience;

  return experience.map((job) => {
    // Filter descriptions to only include role-relevant ones
    const relevantDescriptions = job.description.filter((desc) =>
      matchesRole(desc, role)
    );

    // Filter technologies
    const relevantTechs = job.technologies.filter((tech) => matchesRole(tech, role));

    // Filter achievements
    const relevantAchievements = job.achievements?.filter((achievement) =>
      matchesRole(achievement.title + ' ' + achievement.description, role)
    );

    return {
      ...job,
      description: relevantDescriptions.length > 0 ? relevantDescriptions : job.description.slice(0, 2),
      technologies: relevantTechs.length > 0 ? relevantTechs : job.technologies,
      achievements: relevantAchievements,
    };
  });
}

function filterProjects(projects: Project[], role: RoleType): Project[] {
  if (role === 'all') return projects;

  return projects.filter((project) => {
    // Check if project technologies match role
    const techMatch = project.technologies.some((tech) => matchesRole(tech, role));

    // Check if project description matches role
    const descMatch = matchesRole(project.description, role);

    return techMatch || descMatch;
  });
}

export function filterContentByRole(content: ContentData, role: RoleType): ContentData {
  if (role === 'all') {
    return content;
  }

  return {
    ...content,
    skills: filterSkills(content.skills, role),
    experience: filterExperience(content.experience, role),
    projects: filterProjects(content.projects, role),
  };
}

export function getRoleFromSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>
): RoleType {
  const roleParam =
    searchParams instanceof URLSearchParams
      ? searchParams.get('role')
      : searchParams.role;

  const role = (Array.isArray(roleParam) ? roleParam[0] : roleParam)?.toLowerCase();

  if (
    role === 'frontend' ||
    role === 'backend' ||
    role === 'fullstack' ||
    role === 'devops' ||
    role === 'mobile'
  ) {
    return role;
  }

  return 'all';
}
