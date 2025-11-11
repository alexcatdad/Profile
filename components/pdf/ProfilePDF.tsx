import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { ContentData } from '@/types/content';

// Compact, beautiful PDF styles matching the website aesthetic
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.4,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  // Header Section
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '2pt solid #3B82F6',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
    letterSpacing: -0.8,
  },
  title: {
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 8,
    fontWeight: 'bold',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    fontSize: 8,
    color: '#666666',
    flexWrap: 'wrap',
  },
  contactItem: {
    marginRight: 8,
  },
  // Section Headers
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1pt solid #E5E7EB',
    letterSpacing: -0.3,
  },
  // Summary
  summary: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#374151',
    marginBottom: 12,
    textAlign: 'justify',
  },
  // Skills
  skillsContainer: {
    marginBottom: 12,
  },
  skillCategory: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 6,
    marginBottom: 3,
  },
  skillsList: {
    fontSize: 8,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  // Experience
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  company: {
    fontSize: 10,
    color: '#3B82F6',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  dates: {
    fontSize: 8,
    color: '#6B7280',
  },
  location: {
    fontSize: 8,
    color: '#6B7280',
    marginBottom: 3,
  },
  bulletPoints: {
    marginTop: 3,
  },
  bulletPoint: {
    fontSize: 8,
    color: '#374151',
    marginBottom: 2,
    paddingLeft: 10,
    lineHeight: 1.4,
  },
  technologies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  techTag: {
    fontSize: 7,
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    padding: '2 6',
    borderRadius: 3,
  },
  // Projects
  projectItem: {
    marginBottom: 10,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  projectDescription: {
    fontSize: 8,
    color: '#4B5563',
    lineHeight: 1.4,
    marginBottom: 3,
  },
  projectLink: {
    fontSize: 7,
    color: '#3B82F6',
    textDecoration: 'none',
  },
  // Education
  educationItem: {
    marginBottom: 8,
  },
  degree: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  institution: {
    fontSize: 9,
    color: '#3B82F6',
    marginBottom: 1,
  },
  educationDate: {
    fontSize: 8,
    color: '#6B7280',
  },
  // Metrics
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 7,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Achievements
  achievementItem: {
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 8,
    color: '#4B5563',
    lineHeight: 1.4,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1pt solid #E5E7EB',
    paddingTop: 8,
    fontSize: 7,
    color: '#9CA3AF',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Two column layout
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
});

interface ProfilePDFProps {
  content: ContentData;
}

export function ProfilePDF({ content }: ProfilePDFProps) {
  const { profile, experience, projects, skills, education, certifications, metrics, achievements } = content;

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill.name);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.title}>{profile.title}</Text>
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>{profile.contact.email}</Text>
            {profile.contact.phone && <Text style={styles.contactItem}>{profile.contact.phone}</Text>}
            <Text style={styles.contactItem}>{profile.location}</Text>
            {profile.social.linkedin && <Link src={profile.social.linkedin} style={styles.contactItem}>LinkedIn</Link>}
          </View>
        </View>

        {/* Summary */}
        <Text style={styles.sectionTitle}>Professional Summary</Text>
        <Text style={styles.summary}>{profile.summary.join(' ')}</Text>

        {/* Metrics */}
        {metrics && metrics.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            <View style={styles.metricsRow}>
              {metrics.slice(0, 4).map((metric) => (
                <View key={metric.id} style={styles.metricBox}>
                  <Text style={styles.metricValue}>
                    {metric.prefix}{metric.value}{metric.suffix}
                  </Text>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Skills */}
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        <View style={styles.skillsContainer}>
          {Object.entries(skillsByCategory).slice(0, 6).map(([category, skillNames]) => (
            <View key={category}>
              <Text style={styles.skillCategory}>{category}</Text>
              <Text style={styles.skillsList}>{skillNames.join(' • ')}</Text>
            </View>
          ))}
        </View>

        {/* Experience */}
        <Text style={styles.sectionTitle}>Professional Experience</Text>
        {experience.slice(0, 4).map((exp) => (
          <View key={exp.id} style={styles.experienceItem}>
            <Text style={styles.jobTitle}>{exp.position}</Text>
            <Text style={styles.company}>{exp.company}</Text>
            <View style={styles.experienceHeader}>
              <Text style={styles.location}>{exp.location}</Text>
              <Text style={styles.dates}>
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </Text>
            </View>
            <View style={styles.bulletPoints}>
              {exp.description.slice(0, 3).map((desc, idx) => (
                <Text key={idx} style={styles.bulletPoint}>• {desc}</Text>
              ))}
            </View>
            {exp.technologies && exp.technologies.length > 0 && (
              <View style={styles.technologies}>
                {exp.technologies.slice(0, 8).map((tech) => (
                  <Text key={tech} style={styles.techTag}>{tech}</Text>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Page break for second page */}
      </Page>

      <Page size="A4" style={styles.page}>
        {/* Projects */}
        <Text style={styles.sectionTitle}>Featured Projects</Text>
        {projects.slice(0, 5).map((project) => (
          <View key={project.id} style={styles.projectItem}>
            <Text style={styles.projectName}>{project.name}</Text>
            <Text style={styles.projectDescription}>{project.description}</Text>
            {project.githubUrl && (
              <Link src={project.githubUrl} style={styles.projectLink}>
                {project.githubUrl}
              </Link>
            )}
            {project.technologies && project.technologies.length > 0 && (
              <View style={styles.technologies}>
                {project.technologies.slice(0, 6).map((tech) => (
                  <Text key={tech} style={styles.techTag}>{tech}</Text>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Key Achievements</Text>
            {achievements.slice(0, 4).map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        <Text style={styles.sectionTitle}>Education & Certifications</Text>
        {education.map((edu) => (
          <View key={edu.id} style={styles.educationItem}>
            <Text style={styles.degree}>{edu.degree}</Text>
            <Text style={styles.institution}>{edu.institution}</Text>
            <Text style={styles.educationDate}>
              {edu.startDate} - {edu.endDate}
            </Text>
          </View>
        ))}
        {certifications && certifications.length > 0 && certifications.slice(0, 4).map((cert) => (
          <View key={cert.id} style={styles.educationItem}>
            <Text style={styles.degree}>{cert.name}</Text>
            <Text style={styles.institution}>{cert.issuer}</Text>
            <Text style={styles.educationDate}>{cert.issueDate}</Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
          <Text>Professional Profile • {profile.name}</Text>
        </View>
      </Page>
    </Document>
  );
}
