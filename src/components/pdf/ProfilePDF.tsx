import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { JSONResume } from '@/types/json-resume';

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.45,
    backgroundColor: '#ffffff',
    color: '#0b1220',
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4e7ef',
    paddingBottom: 12,
    marginBottom: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: -0.2,
    color: '#051027',
  },
  title: {
    fontSize: 11,
    color: '#475467',
    marginTop: 3,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  badge: {
    fontSize: 8,
    textTransform: 'uppercase',
    color: '#1d3a5f',
    backgroundColor: '#f1f5ff',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 6,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#d4e0ff',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  contactItem: {
    fontSize: 9,
    color: '#5c6479',
    marginRight: 12,
    marginBottom: 4,
    textDecoration: 'none',
  },
  section: {
    marginBottom: 14,
  },
  sectionCard: {
    backgroundColor: '#f8f9fb',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#edf0f7',
    padding: 12,
  },
  sectionTitle: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: '#7a8197',
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 10,
    color: '#0f172a',
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  metricCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e6f1',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    marginRight: '4%',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: 700,
    color: '#051027',
  },
  metricLabel: {
    fontSize: 8.5,
    color: '#606575',
    marginTop: 2,
  },
  experienceItem: {
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecf3',
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: '#0b1220',
  },
  company: {
    fontSize: 10,
    color: '#2563eb',
    marginTop: 2,
  },
  dateRow: {
    fontSize: 8.5,
    color: '#667085',
    marginTop: 2,
  },
  bulletList: {
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  bulletSymbol: {
    fontSize: 9,
    marginRight: 4,
    color: '#94a3b8',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#1f2933',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    fontSize: 8,
    color: '#1d3a5f',
    backgroundColor: '#eff4ff',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#dfe8ff',
  },
  skillGroup: {
    marginTop: 4,
  },
  skillName: {
    fontSize: 10,
    fontWeight: 600,
    color: '#0b1220',
  },
  skillKeywords: {
    fontSize: 9,
    color: '#4b5565',
    marginTop: 2,
  },
  projectItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eceff6',
  },
  projectName: {
    fontSize: 10.5,
    fontWeight: 600,
    color: '#0b1220',
  },
  projectDescription: {
    fontSize: 9,
    color: '#374151',
    marginTop: 2,
  },
  educationItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eceff6',
  },
  degree: {
    fontSize: 10,
    fontWeight: 600,
    color: '#0b1220',
  },
  institution: {
    fontSize: 9,
    color: '#475467',
    marginTop: 1,
  },
  footer: {
    fontSize: 8,
    color: '#7a8197',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e4e7ef',
    paddingTop: 6,
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
  const targetRoles = resume._custom?.targetRoles
    ? Object.values(resume._custom.targetRoles).map((role) => role.label)
    : [];
  const achievements = resume._custom?.keyAchievements || [];

  const metrics = [
    quantifiable?.yearsExperience
      ? { label: 'Years shipping products', value: `${quantifiable.yearsExperience}+` }
      : null,
    quantifiable?.teamsLed ? { label: 'Teams led', value: `${quantifiable.teamsLed}` } : null,
    quantifiable?.remoteYears
      ? { label: 'Remote-first', value: `${quantifiable.remoteYears}+ yrs` }
      : null,
    resume._custom?.companyPreferences?.primary
      ? {
          label: 'Preferred environment',
          value: resume._custom.companyPreferences.primary,
        }
      : null,
  ].filter((metric): metric is { label: string; value: string } => Boolean(metric));

  const forcePageBreakAfterExperience = (resume.work?.length ?? 0) > 3;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          {basics.name && <Text style={styles.name}>{basics.name}</Text>}
          {basics.label && <Text style={styles.title}>{basics.label}</Text>}
          <View style={styles.badgeRow}>
            {roleLabel && <Text style={styles.badge}>{roleLabel}</Text>}
            {resume._custom?.companyPreferences?.primary && (
              <Text style={styles.badge}>{resume._custom.companyPreferences.primary}</Text>
            )}
            {targetRoles.slice(0, 2).map((role) => (
              <Text key={role} style={styles.badge}>
                {role}
              </Text>
            ))}
          </View>
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

        {basics.summary && (
          <View style={[styles.section, styles.sectionCard]}>
            <Text style={styles.sectionTitle}>Snapshot</Text>
            <Text style={styles.summaryText}>{basics.summary}</Text>
          </View>
        )}

        {metrics.length > 0 && (
          <View style={[styles.section, styles.sectionCard]}>
            <Text style={styles.sectionTitle}>Impact metrics</Text>
            <View style={styles.metricGrid}>
              {metrics.map((metric, index) => (
                <View
                  key={`${metric.label}-${index}`}
                  style={[styles.metricCard, (index + 1) % 2 === 0 ? { marginRight: 0 } : {}]}
                >
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricLabel}>{metric.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {resume.skills && resume.skills.length > 0 && (
          <View style={[styles.section, styles.sectionCard]}>
            <Text style={styles.sectionTitle}>Core skills</Text>
            {resume.skills.slice(0, 5).map((skill) => (
              <View key={skill.name} style={styles.skillGroup}>
                {skill.name && (
                  <Text style={styles.skillName}>
                    {skill.name}
                    {skill.level ? ` • ${skill.level}` : ''}
                  </Text>
                )}
                {skill.keywords && skill.keywords.length > 0 && (
                  <Text style={styles.skillKeywords}>{skill.keywords.join(' • ')}</Text>
                )}
              </View>
            ))}
            {achievements.length > 0 && (
              <View style={{ marginTop: 6 }}>
                <Text style={styles.sectionTitle}>Highlights</Text>
                {achievements.slice(0, 4).map((achievement) => (
                  <View key={achievement} style={styles.bulletRow}>
                    <Text style={styles.bulletSymbol}>•</Text>
                    <Text style={styles.bulletText}>{achievement}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {resume.work && resume.work.length > 0 && (
          <View style={[styles.section, styles.sectionCard]}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {resume.work.slice(0, 5).map((exp) => (
              <View key={(exp.name || '') + (exp.startDate || '') + (exp.position || '')} style={styles.experienceItem}>
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
                {exp.summary && (
                  <View style={styles.bulletList}>
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletSymbol}>•</Text>
                      <Text style={styles.bulletText}>{exp.summary}</Text>
                    </View>
                  </View>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <View style={styles.bulletList}>
                    {exp.highlights.slice(0, 2).map((highlight) => (
                      <View key={highlight} style={styles.bulletRow}>
                        <Text style={styles.bulletSymbol}>•</Text>
                        <Text style={styles.bulletText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                )}
                {exp.keywords && exp.keywords.length > 0 && (
                  <View style={styles.tagRow}>
                    {exp.keywords.slice(0, 6).map((keyword) => (
                      <Text key={keyword} style={styles.tag}>
                        {keyword}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {forcePageBreakAfterExperience && <View break />}

        {resume.projects && resume.projects.length > 0 && (
          <View style={[styles.section, styles.sectionCard]}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {resume.projects.slice(0, 5).map((project) => (
              <View key={project.name} style={styles.projectItem}>
                {project.name && <Text style={styles.projectName}>{project.name}</Text>}
                {project.description && (
                  <Text style={styles.projectDescription}>{project.description}</Text>
                )}
                {project.highlights && project.highlights.length > 0 && (
                  <View style={styles.bulletList}>
                    {project.highlights.slice(0, 2).map((item) => (
                      <View key={item} style={styles.bulletRow}>
                        <Text style={styles.bulletSymbol}>•</Text>
                        <Text style={styles.bulletText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {(resume.education?.length || resume.certificates?.length) && (
          <View style={[styles.section, styles.sectionCard]}>
            <Text style={styles.sectionTitle}>Education & Certifications</Text>
            {resume.education?.slice(0, 3).map((edu) => (
              <View key={(edu.institution || '') + (edu.studyType || '')} style={styles.educationItem}>
                {edu.studyType && (
                  <Text style={styles.degree}>
                    {edu.studyType}
                    {edu.area ? ` • ${edu.area}` : ''}
                  </Text>
                )}
                {edu.institution && <Text style={styles.institution}>{edu.institution}</Text>}
                {(edu.startDate || edu.endDate) && (
                  <Text style={styles.dateRow}>
                    {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                  </Text>
                )}
              </View>
            ))}
            {resume.certificates?.slice(0, 3).map((cert) => (
              <View key={(cert.name || '') + (cert.issuer || '')} style={styles.educationItem}>
                {cert.name && <Text style={styles.degree}>{cert.name}</Text>}
                {cert.issuer && <Text style={styles.institution}>{cert.issuer}</Text>}
                {cert.date && <Text style={styles.dateRow}>{cert.date}</Text>}
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
          {basics.name && <Text>{basics.name} • Professional Profile</Text>}
        </View>
      </Page>
    </Document>
  );
}
