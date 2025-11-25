import type { JSONResume } from '@/types/json-resume';
import type { CoverLetterTemplate } from '@/types/content';

export function generateCoverLetterTemplate(resume: JSONResume): CoverLetterTemplate {
  const basics = resume.basics || {};
  const location = basics.location
    ? `${basics.location.city || ''}${basics.location.city && basics.location.countryCode ? ', ' : ''}${basics.location.countryCode || ''}`
    : '';

  return {
    header: {
      name: basics.name || '',
      title: basics.label || '',
      email: basics.email || '',
      phone: basics.phone || '',
      location: location,
      linkedin: basics.profiles?.find((p) => p.network === 'LinkedIn')?.url || '',
    },
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    recipient: {
      name: 'Hiring Manager',
      company: '',
      address: '',
      city: '',
    },
    salutation: 'Dear Hiring Manager,',
    paragraphs: {
      introduction: resume._custom?.coverLetterHooks?.remoteExpert || '',
      qualifications: resume._custom?.coverLetterHooks?.handsonLeader || '',
      alignment: resume._custom?.coverLetterHooks?.opensourcePhilosophy || '',
      closing: 'I look forward to discussing how my experience can contribute to your team.',
    },
    signature: {
      closing: 'Sincerely,',
      name: basics.name || '',
      title: basics.label || '',
    },
  };
}

