import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { ContentData } from '@/types/content';

// Compact, beautiful PDF styles matching the website aesthetic
const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  // Header Section
  header: {
    marginBottom: 24,
    paddingBottom: 20,
    borderBottom: '3pt solid #3B82F6',
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 8,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1a1a1a',
    letterSpacing: -1,
  },
  title: {
    fontSize: 14,
    color: '#3B82F6',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 16,
    fontSize: 9,
    color: '#6B7280',
    flexWrap: 'wrap',
  },
  contactItem: {
    marginRight: 12,
  },
  // Section Headers
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 20,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: '2pt solid #E5E7EB',
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  // Summary
  summary: {
    fontSize: 10,
    lineHeight: 1.6,
    color: '#374151',
    marginBottom: 16,
    textAlign: 'justify',
  },
  // Skills
  skillsContainer: {
    marginBottom: 16,
  },
  skillCategory: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginTop: 8,
    marginBottom: 4,
  },
  skillsList: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.5,
  },
  // Experience
  experienceItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderLeft: '4pt solid #3B82F6',
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  experienceLeft: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  company: {
    fontSize: 10,
    color: '#3B82F6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  experienceRight: {
    alignItems: 'flex-end',
  },
  dates: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 2,
  },
  location: {
    fontSize: 9,
    color: '#6B7280',
  },
  bulletPoints: {
    marginTop: 6,
  },
  bulletPoint: {
    fontSize: 9,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 1.6,
  },
  technologies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 6,
  },
  techTag: {
    fontSize: 7,
    color: '#3B82F6',
    backgroundColor: '#EFF6FF',
    padding: '3 8',
    borderRadius: 4,
    border: '1pt solid #BFDBFE',
  },
  // Projects
  projectItem: {
    marginBottom: 14,
    padding: 12,
    backgroundColor: '#FAF5FF',
    borderRadius: 6,
    borderLeft: '4pt solid #8B5CF6',
  },
  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.6,
    marginBottom: 6,
  },
  projectLink: {
    fontSize: 8,
    color: '#3B82F6',
    textDecoration: 'none',
  },
  // Education
  educationItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
    borderLeft: '4pt solid #10B981',
  },
  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  institution: {
    fontSize: 10,
    color: '#10B981',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  educationDate: {
    fontSize: 9,
    color: '#6B7280',
  },
  // Metrics
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    border: '1pt solid #BFDBFE',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 8,
    color: '#6B7280',
    textAlign: 'center',
  },
  // Achievements
  achievementItem: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#FFFBEB',
    borderRadius: 6,
    borderLeft: '4pt solid #F59E0B',
  },
  achievementTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  achievementDescription: {
    fontSize: 9,
    color: '#4B5563',
    lineHeight: 1.6,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 48,
    right: 48,
    borderTop: '1pt solid #E5E7EB',
    paddingTop: 10,
    fontSize: 8,
    color: '#9CA3AF',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Stats inline
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 8,
    color: '#6B7280',
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
        {experience.slice(0, 3).map((exp) => (
          <View key={exp.id} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <View style={styles.experienceLeft}>
                <Text style={styles.jobTitle}>{exp.position}</Text>
                <Text style={styles.company}>{exp.company}</Text>
              </View>
              <View style={styles.experienceRight}>
                <Text style={styles.dates}>
                  {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                </Text>
                <Text style={styles.location}>{exp.location}</Text>
              </View>
            </View>
            <View style={styles.bulletPoints}>
              {exp.description.slice(0, 2).map((desc, idx) => (
                <Text key={idx} style={styles.bulletPoint}>• {desc}</Text>
              ))}
            </View>
            {exp.technologies && exp.technologies.length > 0 && (
              <View style={styles.technologies}>
                {exp.technologies.slice(0, 6).map((tech) => (
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
        {projects.slice(0, 4).map((project) => (
          <View key={project.id} style={styles.projectItem}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Text style={styles.projectName}>{project.name}</Text>
              {(project.stars !== undefined || project.downloads !== undefined) && (
                <View style={styles.statsRow}>
                  {project.stars !== undefined && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>★ {project.stars}</Text>
                    </View>
                  )}
                  {project.downloads !== undefined && (
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>↓ {project.downloads}</Text>
                    </View>
                  )}
                </View>
              )}
            </View>
            <Text style={styles.projectDescription}>{project.description}</Text>
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
            {achievements.slice(0, 3).map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>{achievement.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        <Text style={styles.sectionTitle}>Education</Text>
        {education.map((edu) => (
          <View key={edu.id} style={styles.educationItem}>
            <Text style={styles.degree}>{edu.degree} - {edu.field}</Text>
            <Text style={styles.institution}>{edu.institution}</Text>
            <Text style={styles.educationDate}>
              {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
            </Text>
          </View>
        ))}
        {certifications && certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.slice(0, 4).map((cert) => (
              <View key={cert.id} style={styles.educationItem}>
                <Text style={styles.degree}>{cert.name}</Text>
                <Text style={styles.institution}>{cert.issuer}</Text>
                <Text style={styles.educationDate}>{cert.issueDate}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
          <Text>Professional Profile • {profile.name}</Text>
        </View>
      </Page>
    </Document>
  );
}
