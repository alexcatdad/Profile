import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { CoverLetterTemplate } from '@/types/content';

// Register fonts (using system fonts as fallback)
Font.register({
  family: 'System',
  fonts: [
    { src: '/fonts/system-regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/system-bold.ttf', fontWeight: 'bold' },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
    color: '#1a1a1a',
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 30,
    borderBottom: '1pt solid #e5e5e5',
    paddingBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000',
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 12,
  },
  contactInfo: {
    fontSize: 10,
    color: '#666666',
    flexDirection: 'row',
    gap: 12,
  },
  contactItem: {
    marginRight: 12,
  },
  date: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 25,
  },
  recipient: {
    marginBottom: 25,
  },
  recipientLine: {
    fontSize: 11,
    marginBottom: 2,
    color: '#1a1a1a',
  },
  salutation: {
    fontSize: 11,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 16,
    textAlign: 'justify',
    lineHeight: 1.7,
    color: '#1a1a1a',
  },
  signature: {
    marginTop: 30,
  },
  signatureClosing: {
    fontSize: 11,
    marginBottom: 40,
  },
  signatureName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  signatureTitle: {
    fontSize: 10,
    color: '#666666',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 60,
    right: 60,
    borderTop: '1pt solid #e5e5e5',
    paddingTop: 10,
    fontSize: 8,
    color: '#999999',
    textAlign: 'center',
  },
});

interface CoverLetterPDFProps {
  template: CoverLetterTemplate;
}

export function CoverLetterPDF({ template }: CoverLetterPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{template.header.name}</Text>
          <Text style={styles.title}>{template.header.title}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>{template.header.email}</Text>
            {template.header.phone && (
              <Text style={styles.contactItem}>{template.header.phone}</Text>
            )}
            <Text style={styles.contactItem}>{template.header.location}</Text>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.date}>{template.date}</Text>

        {/* Recipient */}
        <View style={styles.recipient}>
          <Text style={styles.recipientLine}>{template.recipient.name}</Text>
          <Text style={styles.recipientLine}>{template.recipient.company}</Text>
          {template.recipient.address && (
            <Text style={styles.recipientLine}>{template.recipient.address}</Text>
          )}
          {template.recipient.city && (
            <Text style={styles.recipientLine}>{template.recipient.city}</Text>
          )}
        </View>

        {/* Salutation */}
        <Text style={styles.salutation}>{template.salutation}</Text>

        {/* Body Paragraphs */}
        <Text style={styles.paragraph}>{template.paragraphs.introduction}</Text>
        <Text style={styles.paragraph}>{template.paragraphs.qualifications}</Text>
        <Text style={styles.paragraph}>{template.paragraphs.alignment}</Text>
        <Text style={styles.paragraph}>{template.paragraphs.closing}</Text>

        {/* Signature */}
        <View style={styles.signature}>
          <Text style={styles.signatureClosing}>{template.signature.closing}</Text>
          <Text style={styles.signatureName}>{template.signature.name}</Text>
          <Text style={styles.signatureTitle}>{template.signature.title}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Generated on {new Date().toLocaleDateString()} • Professional Cover Letter
          </Text>
        </View>
      </Page>
    </Document>
  );
}
