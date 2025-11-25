import type { CoverLetterTemplate } from '@/types/content';
import type { JSONResume } from '@/types/json-resume';
import type { LLMClient } from './llm-client';
import { filterResumeByRole, type RoleType } from './role-filter';

export interface GenerateCoverLetterOptions {
  resume: JSONResume;
  jdMarkdown: string;
  companyName: string;
  role?: RoleType;
  llmClient: LLMClient;
}

/**
 * Generates a cover letter using AI based on resume and job description
 */
export async function generateCoverLetter(
  options: GenerateCoverLetterOptions
): Promise<CoverLetterTemplate> {
  const { resume, jdMarkdown, companyName, role, llmClient } = options;

  // Filter resume by role if specified
  const filteredResume = role ? filterResumeByRole(resume, role) : resume;

  // Build the prompt
  const prompt = buildPrompt(filteredResume, jdMarkdown, companyName);

  // Generate with LLM
  const response = await llmClient.generate(prompt, {
    temperature: 0.7,
    maxTokens: 4000,
  });

  // Parse the JSON response
  const coverLetter = parseLLMResponse(response, resume);

  return coverLetter;
}

/**
 * Builds the prompt for the LLM
 */
function buildPrompt(resume: JSONResume, jdMarkdown: string, companyName: string): string {
  const basics = resume.basics || {};
  const coverLetterHooks = resume._custom?.coverLetterHooks || {};
  const hooksList = Object.entries(coverLetterHooks)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');

  // Extract relevant work experience highlights
  const workHighlights = (resume.work || [])
    .slice(0, 3) // Most recent 3 roles
    .map((job) => {
      const highlights = (job.highlights || []).slice(0, 3).join('; ');
      return `- ${job.position} at ${job.name}: ${highlights}`;
    })
    .join('\n');

  // Extract relevant skills
  const skillsList = (resume.skills || [])
    .slice(0, 10)
    .map((skill) => skill.name || '')
    .filter(Boolean)
    .join(', ');

  return `You are a professional resume writer helping craft a tailored cover letter.

RESUME CONTEXT:
Name: ${basics.name || 'Candidate'}
Title: ${basics.label || ''}
Summary: ${basics.summary || ''}

KEY EXPERIENCE HIGHLIGHTS:
${workHighlights}

RELEVANT SKILLS:
${skillsList}

COVER LETTER HOOKS (use 2-3 of these naturally in the letter):
${hooksList}

JOB DESCRIPTION:
${jdMarkdown}

TASK:
Write a professional, authentic cover letter that:
1. Demonstrates genuine interest in ${companyName} and the role
2. Highlights relevant experience from the resume that matches the JD requirements
3. Weaves in 2-3 of the cover letter hooks naturally (don't force them)
4. Shows understanding of what the company/role needs
5. Maintains a professional but personable tone

OUTPUT FORMAT:
Return ONLY valid JSON matching this exact structure:
{
  "header": {
    "name": "${basics.name || ''}",
    "title": "${basics.label || ''}",
    "email": "${basics.email || ''}",
    "phone": "${basics.phone || ''}",
    "location": "${formatLocation(basics.location)}",
    "linkedin": "${basics.profiles?.find((p) => p.network === 'LinkedIn')?.url || ''}"
  },
  "date": "${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}",
  "recipient": {
    "name": "Hiring Manager",
    "company": "${companyName}",
    "address": "",
    "city": ""
  },
  "salutation": "Dear Hiring Manager,",
  "paragraphs": {
    "introduction": "Opening paragraph introducing yourself and expressing interest...",
    "qualifications": "Paragraph highlighting relevant skills and experience...",
    "alignment": "Paragraph explaining why you're a great fit...",
    "closing": "Closing paragraph expressing enthusiasm and next steps..."
  },
  "signature": {
    "closing": "Sincerely,",
    "name": "${basics.name || ''}",
    "title": "${basics.label || ''}"
  }
}

IMPORTANT:
- Each paragraph should be 2-4 sentences
- Be specific about how your experience matches their needs
- Don't repeat information unnecessarily
- Keep the tone professional but warm
- Return ONLY the JSON, no markdown formatting, no code blocks`;
}

/**
 * Parses the LLM response and extracts the JSON cover letter
 */
function parseLLMResponse(response: string, resume: JSONResume): CoverLetterTemplate {
  // Try to extract JSON from the response (might be wrapped in markdown code blocks)
  let jsonStr = response.trim();

  // Remove markdown code blocks if present
  jsonStr = jsonStr
    .replace(/^```json\n?/i, '')
    .replace(/^```\n?/i, '')
    .replace(/\n?```$/i, '');

  // Try to find JSON object
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  try {
    const parsed = JSON.parse(jsonStr) as Partial<CoverLetterTemplate>;

    // Validate and fill in defaults
    const basics = resume.basics || {};
    const location = formatLocation(basics.location);

    return {
      header: {
        name: parsed.header?.name || basics.name || '',
        title: parsed.header?.title || basics.label || '',
        email: parsed.header?.email || basics.email || '',
        phone: parsed.header?.phone || basics.phone || '',
        location: parsed.header?.location || location,
        linkedin:
          parsed.header?.linkedin ||
          basics.profiles?.find((p) => p.network === 'LinkedIn')?.url ||
          '',
      },
      date:
        parsed.date ||
        new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      recipient: {
        name: parsed.recipient?.name || 'Hiring Manager',
        company: parsed.recipient?.company || '',
        address: parsed.recipient?.address || '',
        city: parsed.recipient?.city || '',
      },
      salutation: parsed.salutation || 'Dear Hiring Manager,',
      paragraphs: {
        introduction: parsed.paragraphs?.introduction || '',
        qualifications: parsed.paragraphs?.qualifications || '',
        alignment: parsed.paragraphs?.alignment || '',
        closing: parsed.paragraphs?.closing || '',
      },
      signature: {
        closing: parsed.signature?.closing || 'Sincerely,',
        name: parsed.signature?.name || basics.name || '',
        title: parsed.signature?.title || basics.label || '',
      },
    };
  } catch (_error) {
    throw new Error(
      `Failed to parse LLM response as JSON. Response: ${response.substring(0, 200)}...`
    );
  }
}

function formatLocation(location?: {
  city?: string;
  countryCode?: string;
  region?: string;
}): string {
  if (!location) return '';
  const parts = [location.city, location.region, location.countryCode].filter(Boolean);
  return parts.join(', ');
}
