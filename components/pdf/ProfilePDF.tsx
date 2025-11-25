import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { JSONResume } from '@/types/json-resume';

const styles = StyleSheet.create({
  page: {
    padding: 42,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: '#0f172a',
    backgroundColor: '#f6f8fb',
  },
  headerCard: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 4,
  },
  title: {
    fontSize: 13,
    color: '#4ade80',
    fontWeight: 600,
  },
  roleTag: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#4ade80',
    fontSize: 9,
    fontWeight: 600,
    color: '#f8fafc',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 14,
  },
  contactItem: {
    color: '#e2e8f0',
    marginRight: 12,
    marginBottom: 6,
    fontSize: 9,
    textDecoration: 'none',
  },
  twoColumn: {
    flexDirection: 'row',
  },
  columnMain: {
    flex: 1.8,
  },
  columnAside: {
    flex: 1,
    marginLeft: 18,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  summary: {
    fontSize: 10,
    color: '#1e293b',
  },
  metricCard: {
    borderRadius: 14,
    padding: 12,
    backgroundColor: '#0f172a',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 700,
    color: '#f8fafc',
  },
  metricLabel: {
    fontSize: 9,
    color: '#cbd5f5',
  },
  experienceItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
    paddingLeft: 12,
    marginBottom: 14,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0f172a',
  },
  company: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: 600,
  },
  dateRow: {
    fontSize: 9,
    color: '#475569',
    marginTop: 2,
  },
  highlight: {
    fontSize: 9,
    color: '#1e293b',
    marginTop: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  tag: {
    fontSize: 8,
    color: '#0f172a',
    backgroundColor: '#e2fbe2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 4,
    marginBottom: 4,
  },
  skillCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#fbfdff',
  },
  skillName: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0f172a',
  },
  skillKeywords: {
    fontSize: 9,
    color: '#475569',
    marginTop: 4,
  },
  achievementsList: {
    marginTop: 6,
  },
  achievementItem: {
    fontSize: 9,
    color: '#1e293b',
    marginBottom: 4,
  },
  projectCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#d4dbe8',
    padding: 14,
    marginBottom: 14,
  },
  projectName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 9,
    color: '#1f2937',
  },
  educationItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 10,
  },
  degree: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0f172a',
  },
  institution: {
    fontSize: 9,
    color: '#0f6f9c',
    marginTop: 2,
  },
  footer: {
    fontSize: 8,
    color: '#64748b',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

interface ProfilePDFProps {
  resume: JSONResume;
  roleLabel?: string;
}

const parseDate = (date?: string) => {
  if (!date) return null;
  const [year, month = '01'] = date.split('-');
  return new Date(Number(year), Number(month) - 1 || 0);
};

const formatDate = (date?: string) => {
  if (!date) return 'Present';
  const parsed = parseDate(date);
  if (!parsed) return 'Present';
  return parsed.toLocaleString('en', { month: 'short', year: 'numeric' });
};

const formatDuration = (start?: string, end?: string) => {
  const startDate = parseDate(start);
  if (!startDate) return null;
  const endDate = parseDate(end) ?? new Date();
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  const parts = [];
  if (years > 0) parts.push(`${years}y`);
  if (remainder > 0) parts.push(`${remainder}m`);
  return parts.join(' ');
};

export function ProfilePDF({ resume, roleLabel }: ProfilePDFProps) {
  const basics = resume.basics || {};
  const location = basics.location
    ? `${basics.location.city || ''}${basics.location.city && basics.location.countryCode ? ', ' : ''}${basics.location.countryCode || ''}`
    : '';
  const linkedInProfile = basics.profiles?.find((p) => p.network === 'LinkedIn');
  const quantifiable = resume._custom?.quantifiableMetrics;

  const metrics = [
    quantifiable?.yearsExperience
      ? {
          label: 'Years shipping products',
          value: `${quantifiable.yearsExperience}+`,
        }
      : null,
    quantifiable?.teamsLed
      ? {
          label: 'Teams led',
          value: `${quantifiable.teamsLed}`,
        }
      : null,
    quantifiable?.remoteYears
      ? {
          label: 'Remote-first',
          value: `${quantifiable.remoteYears}+ yrs`,
        }
      : null,
    resume._custom?.companyPreferences?.primary
      ? {
          label: 'Preferred environment',
          value: resume._custom.companyPreferences.primary,
        }
      : null,
  ].filter((metric): metric is { label: string; value: string } => Boolean(metric));

  const achievements = resume._custom?.keyAchievements || [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerCard}>
          {basics.name && <Text style={styles.name}>{basics.name}</Text>}
          {basics.label && <Text style={styles.title}>{basics.label}</Text>}
          {roleLabel && <Text style={styles.roleTag}>{roleLabel} profile</Text>}
          <View style={styles.contactRow}>
            {basics.email && <Text style={styles.contactItem}>{basics.email}</Text>}
            {location && <Text style={styles.contactItem}>{location}</Text>}
            {linkedInProfile && (
              <Link src={linkedInProfile.url} style={styles.contactItem}>
                LinkedIn
              </Link>
            )}
            {basics.url && (
              <Link src={basics.url} style={styles.contactItem}>
                Portfolio
              </Link>
            )}
          </View>
        </View>

        <View style={styles.twoColumn}>
          <View style={styles.columnMain}>
            {basics.summary && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Snapshot</Text>
                <Text style={styles.summary}>{basics.summary}</Text>
              </View>
            )}
            {resume.work && resume.work.length > 0 && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Experience</Text>
                {resume.work.slice(0, 5).map((exp, index) => (
                  <View key={index} style={styles.experienceItem}>
                    {exp.position && <Text style={styles.jobTitle}>{exp.position}</Text>}
                    {exp.name && <Text style={styles.company}>{exp.name}</Text>}
                    {(exp.startDate || exp.endDate) && (
                      <Text style={styles.dateRow}>
                        {formatDate(exp.startDate)} — {formatDate(exp.endDate)}{' '}
                        {formatDuration(exp.startDate, exp.endDate)
                          ? `• ${formatDuration(exp.startDate, exp.endDate)}`
                          : ''}
                      </Text>
                    )}
                    {exp.summary && <Text style={styles.highlight}>{exp.summary}</Text>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <View>
                        {exp.highlights.slice(0, 3).map((highlight, hIndex) => (
                          <Text key={hIndex} style={styles.highlight}>
                            • {highlight}
                          </Text>
                        ))}
                      </View>
                    )}
                    {exp.keywords && exp.keywords.length > 0 && (
                      <View style={styles.tagRow}>
                        {exp.keywords.slice(0, 6).map((keyword, kIndex) => (
                          <Text key={kIndex} style={styles.tag}>
                            {keyword}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.columnAside}>
            {metrics.length > 0 && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Impact metrics</Text>
                {metrics.map((metric, index) => (
                  <View key={index} style={styles.metricCard}>
                    <Text style={styles.metricValue}>{metric.value}</Text>
                    <Text style={styles.metricLabel}>{metric.label}</Text>
                  </View>
                ))}
              </View>
            )}

            {resume.skills && resume.skills.length > 0 && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Core skills</Text>
                {resume.skills.slice(0, 4).map((skill, index) => (
                  <View key={index} style={styles.skillCard}>
                    {skill.name && (
                      <Text style={styles.skillName}>
                        {skill.name}
                        {skill.level ? ` • ${skill.level}` : ''}
                      </Text>
                    )}
                    {skill.keywords && skill.keywords.length > 0 && (
                      <Text style={styles.skillKeywords}>{skill.keywords.join(' • ')}</Text>
                    )}
                    {skill.practicalApplications && skill.practicalApplications.length > 0 && (
                      <View style={styles.achievementsList}>
                        {skill.practicalApplications.slice(0, 2).map((useCase, useIndex) => (
                          <Text key={useIndex} style={styles.achievementItem}>
                            ↳ {useCase}
                          </Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}

            {achievements.length > 0 && (
              <View style={styles.sectionCard}>
                <Text style={styles.sectionTitle}>Highlights</Text>
                <View style={styles.achievementsList}>
                  {achievements.slice(0, 5).map((achievement, index) => (
                    <Text key={index} style={styles.achievementItem}>
                      • {achievement}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
          {basics.name && <Text>{basics.name} • Professional Profile</Text>}
        </View>
      </Page>

      {(resume.projects || resume.education || resume.certificates) && (
        <Page size="A4" style={styles.page}>
          {resume.projects && resume.projects.length > 0 && (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Featured projects</Text>
              {resume.projects.slice(0, 4).map((project, index) => (
                <View key={index} style={styles.projectCard}>
                  {project.name && <Text style={styles.projectName}>{project.name}</Text>}
                  {project.description && (
                    <Text style={styles.projectDescription}>{project.description}</Text>
                  )}
                  {project.highlights && project.highlights.length > 0 && (
                    <View style={styles.achievementsList}>
                      {project.highlights.slice(0, 3).map((item, hIndex) => (
                        <Text key={hIndex} style={styles.achievementItem}>
                          • {item}
                        </Text>
                      ))}
                    </View>
                  )}
                  {project.keywords && project.keywords.length > 0 && (
                    <View style={styles.tagRow}>
                      {project.keywords.slice(0, 6).map((keyword, kIndex) => (
                        <Text key={kIndex} style={styles.tag}>
                          {keyword}
                        </Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {(resume.education && resume.education.length > 0) || (resume.certificates && resume.certificates.length > 0) ? (
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Education & Certifications</Text>
              {resume.education?.map((edu, index) => (
                <View key={`edu-${index}`} style={styles.educationItem}>
                  {edu.studyType && (
                    <Text style={styles.degree}>
                      {edu.studyType}
                      {edu.area ? ` • ${edu.area}` : ''}
                    </Text>
                  )}
                  {edu.institution && <Text style={styles.institution}>{edu.institution}</Text>}
                  {(edu.startDate || edu.endDate) && (
                    <Text style={styles.metricLabel}>
                      {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                    </Text>
                  )}
                </View>
              ))}

              {resume.certificates?.map((cert, index) => (
                <View key={`cert-${index}`} style={styles.educationItem}>
                  {cert.name && <Text style={styles.degree}>{cert.name}</Text>}
                  {cert.issuer && <Text style={styles.institution}>{cert.issuer}</Text>}
                  {cert.date && <Text style={styles.metricLabel}>{cert.date}</Text>}
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.footer}>
            <Text>Generated on {new Date().toLocaleDateString()}</Text>
            {basics.name && <Text>{basics.name} • Professional Profile</Text>}
          </View>
        </Page>
      )}
    </Document>
  );
}
