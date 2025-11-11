import type { ContentData } from '@/types/content';

export function generateMarkdown(content: ContentData): string {
  const { profile, experience, projects, skills, education, certifications, metrics, achievements, awards, publications } = content;

  const sections: string[] = [];

  // Header
  sections.push(`# ${profile.name}`);
  sections.push(`## ${profile.title}`);
  sections.push('');
  sections.push(`📧 ${profile.contact.email} | 📍 ${profile.location}${profile.contact.phone ? ` | 📱 ${profile.contact.phone}` : ''}`);
  sections.push('');

  // Links
  if (profile.social.linkedin || profile.social.github || profile.social.twitter) {
    const links: string[] = [];
    if (profile.social.linkedin) links.push(`[LinkedIn](${profile.social.linkedin})`);
    if (profile.social.github) links.push(`[GitHub](${profile.social.github})`);
    if (profile.social.twitter) links.push(`[Twitter](${profile.social.twitter})`);
    sections.push(links.join(' • '));
    sections.push('');
  }

  sections.push('---');
  sections.push('');

  // Professional Summary
  sections.push('## Professional Summary');
  sections.push('');
  sections.push(profile.summary.join('\n\n'));
  sections.push('');

  // Metrics
  if (metrics && metrics.length > 0) {
    sections.push('## Key Metrics');
    sections.push('');
    metrics.forEach((metric) => {
      sections.push(`**${metric.label}**: ${metric.prefix || ''}${metric.value}${metric.suffix || ''}`);
    });
    sections.push('');
  }

  // Skills
  sections.push('## Technical Skills');
  sections.push('');

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  Object.entries(skillsByCategory).forEach(([category, skillNames]) => {
    sections.push(`### ${category}`);
    sections.push(skillNames.join(' • '));
    sections.push('');
  });

  // Professional Experience
  sections.push('## Professional Experience');
  sections.push('');

  experience.forEach((exp) => {
    sections.push(`### ${exp.position}`);
    sections.push(`**${exp.company}** • ${exp.location}`);
    sections.push(`*${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}*`);
    sections.push('');

    exp.description.forEach((desc) => {
      sections.push(`- ${desc}`);
    });
    sections.push('');

    if (exp.technologies && exp.technologies.length > 0) {
      sections.push(`**Technologies**: ${exp.technologies.join(', ')}`);
      sections.push('');
    }
  });

  // Projects
  sections.push('## Featured Projects');
  sections.push('');

  projects.forEach((project) => {
    sections.push(`### ${project.name}`);
    sections.push('');
    sections.push(project.description);
    sections.push('');

    if (project.stars !== undefined || project.downloads !== undefined) {
      const stats: string[] = [];
      if (project.stars !== undefined) stats.push(`⭐ ${project.stars} stars`);
      if (project.downloads !== undefined) stats.push(`📥 ${project.downloads} downloads`);
      sections.push(stats.join(' • '));
      sections.push('');
    }

    if (project.technologies && project.technologies.length > 0) {
      sections.push(`**Technologies**: ${project.technologies.join(', ')}`);
      sections.push('');
    }

    if (project.githubUrl) {
      sections.push(`🔗 [View on GitHub](${project.githubUrl})`);
      sections.push('');
    }
  });

  // Achievements
  if (achievements && achievements.length > 0) {
    sections.push('## Key Achievements');
    sections.push('');

    achievements.forEach((achievement) => {
      sections.push(`### ${achievement.title}`);
      if (achievement.date) {
        sections.push(`*${new Date(achievement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}*`);
      }
      sections.push('');
      sections.push(achievement.description);
      sections.push('');

      if (achievement.metric) {
        sections.push(`**Impact**: ${achievement.metric.value} ${achievement.metric.label}`);
        sections.push('');
      }
    });
  }

  // Awards
  if (awards && awards.length > 0) {
    sections.push('## Awards & Recognition');
    sections.push('');

    awards.forEach((award) => {
      sections.push(`### ${award.title}`);
      sections.push(`**${award.issuer}** • ${award.date}`);
      sections.push('');
      if (award.description) {
        sections.push(award.description);
        sections.push('');
      }

      if (award.url) {
        sections.push(`🔗 [View Award](${award.url})`);
        sections.push('');
      }
    });
  }

  // Publications
  if (publications && publications.length > 0) {
    sections.push('## Publications');
    sections.push('');

    publications.forEach((pub) => {
      sections.push(`### ${pub.title}`);
      sections.push(`**${pub.publisher}** • ${pub.date} • ${pub.type}`);
      sections.push('');
      if (pub.description) {
        sections.push(pub.description);
        sections.push('');
      }

      if (pub.url) {
        sections.push(`🔗 [Read Publication](${pub.url})`);
        sections.push('');
      }
    });
  }

  // Education
  sections.push('## Education');
  sections.push('');

  education.forEach((edu) => {
    sections.push(`### ${edu.degree} - ${edu.field}`);
    sections.push(`**${edu.institution}**`);
    sections.push(`*${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}*`);
    sections.push('');
  });

  // Certifications
  if (certifications && certifications.length > 0) {
    sections.push('## Certifications');
    sections.push('');

    certifications.forEach((cert) => {
      sections.push(`- **${cert.name}** - ${cert.issuer} (${cert.issueDate})`);
      if (cert.credentialId) {
        sections.push(`  - Credential ID: ${cert.credentialId}`);
      }
      if (cert.url) {
        sections.push(`  - [Verify](${cert.url})`);
      }
    });
    sections.push('');
  }

  // Footer
  sections.push('---');
  sections.push('');
  sections.push(`*Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*`);

  return sections.join('\n');
}
