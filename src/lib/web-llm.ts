'use client';

import { CreateMLCEngine, type MLCEngineInterface } from '@mlc-ai/web-llm';
import type { JSONResume } from '@/types/json-resume';

export interface ResumeChatResponse {
  answer: string;
  sections: Array<'experience' | 'skills' | 'projects' | 'personal'>;
  itemIds?: string[];
}

export interface WebLLMOptions {
  model?: string;
  onProgress?: (progress: number, text: string) => void;
}

/**
 * WebLLM service for resume Q&A using MLC Web-LLM
 */
export class WebLLMService {
  private engine: MLCEngineInterface | null = null;
  private isLoading = false;
  private resumeContext: string = '';
  private modelId: string;
  // Store the onProgress callback if needed, though passing it to initialize is fine

  constructor(resume: JSONResume, options: WebLLMOptions = {}) {
    // MLC Web-LLM model ID - must match exactly from https://mlc.ai/models
    // Using Llama 3.2 3B for better reasoning and instruction following
    this.modelId = options.model || 'Llama-3.2-3B-Instruct-q4f16_1-MLC';
    this.resumeContext = this.buildResumeContext(resume);
  }

  /**
   * Build a concise text representation of the resume for LLM context
   */
  private buildResumeContext(resume: JSONResume): string {
    const parts: string[] = [];

    if (resume.basics) {
      parts.push(`Name: ${resume.basics.name}`);
      parts.push(`Label: ${resume.basics.label}`);
      parts.push(`Summary: ${resume.basics.summary}`);
      if (resume.basics.location) {
        parts.push(
          `Location: ${resume.basics.location.city}, ${resume.basics.location.region}, ${resume.basics.location.countryCode}`
        );
      }
      if (resume.basics.profiles) {
        parts.push(
          `Profiles: ${resume.basics.profiles.map((p) => `${p.network} (${p.username})`).join(', ')}`
        );
      }
    }

    // Work
    if (resume.work && resume.work.length > 0) {
      parts.push('\nExperience:');
      resume.work.forEach((job) => {
        const dateRange = `${job.startDate || ''} - ${job.endDate || 'Present'}`;
        parts.push(`${job.position || 'N/A'} at ${job.name || 'N/A'} (${dateRange})`);
        if (job.summary) parts.push(`Summary: ${job.summary}`);
        if (job.highlights && job.highlights.length > 0) {
          parts.push(`Highlights: ${job.highlights.join('; ')}`);
        }
      });
    }

    // Skills
    if (resume.skills && resume.skills.length > 0) {
      parts.push('\nSkills:');
      resume.skills.forEach((skill) => {
        parts.push(`${skill.name}: ${skill.keywords ? skill.keywords.join(', ') : ''}`);
      });
    }

    // Projects
    if (resume.projects && resume.projects.length > 0) {
      parts.push('\nProjects:');
      resume.projects.forEach((project) => {
        parts.push(
          `${project.name}: ${project.description || ''} (${project.keywords ? project.keywords.join(', ') : ''})`
        );
      });
    }

    // Education
    if (resume.education && resume.education.length > 0) {
      parts.push('\nEducation:');
      resume.education.forEach((edu, index) => {
        const dateRange =
          edu.startDate && edu.endDate
            ? `(${edu.startDate} to ${edu.endDate})`
            : edu.startDate
              ? `(Started ${edu.startDate})`
              : '';
        parts.push(
          `[education.${index}] - ${edu.studyType || 'N/A'} in ${edu.area || 'N/A'} from ${edu.institution || 'N/A'} ${dateRange}`
        );
      });
    }

    if (resume.volunteer && resume.volunteer.length > 0) {
      parts.push('\nVolunteer:');
      resume.volunteer.forEach((vol, index) => {
        const dateRange =
          vol.startDate && vol.endDate
            ? `(${vol.startDate} to ${vol.endDate})`
            : vol.startDate
              ? `(Started ${vol.startDate})`
              : '';
        parts.push(
          `[volunteer.${index}] - ${vol.position || 'N/A'} at ${vol.organization || 'N/A'} ${dateRange}`
        );
        if (vol.summary) parts.push(`  ${vol.summary}`);
      });
    }

    if (resume._custom?.quantifiableMetrics) {
      const metrics = resume._custom.quantifiableMetrics;
      parts.push('\nKey Metrics:');
      if (metrics.yearsExperience) parts.push(`- ${metrics.yearsExperience}+ years of experience`);
      if (metrics.teamsLed) parts.push(`- Led ${metrics.teamsLed} teams`);
      if (metrics.remoteYears) parts.push(`- ${metrics.remoteYears}+ years remote work`);
    }

    return parts.join('\n');
  }

  /**
   * Initialize the MLC engine
   */
  async initialize(onProgress?: (progress: number, text: string) => void): Promise<void> {
    if (this.engine) {
      return;
    }

    if (this.isLoading) {
      throw new Error('Engine is already initializing');
    }

    this.isLoading = true;

    try {
      // Use the model ID directly; CreateMLCEngine will handle fetching configuration.
      const engine = await CreateMLCEngine(this.modelId, {
        initProgressCallback: (report) => {
          if (onProgress) {
            const progress = report.progress;
            onProgress(progress, report.text);
          }
        },
      });

      this.engine = engine;
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      throw new Error(
        `Failed to initialize WebLLM: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Check if engine is ready
   */
  isReady(): boolean {
    return this.engine !== null && !this.isLoading;
  }

  /**
   * Generate a streaming response to a question about the resume
   */
  async *askQuestion(
    question: string,
    onChunk?: (chunk: string) => void
  ): AsyncGenerator<string, ResumeChatResponse> {
    if (!this.engine) {
      throw new Error('Engine not initialized. Call initialize() first.');
    }

    // System prompt is good - it clearly instructs the LLM on its role and the required output format.
    const systemPrompt = `You are the interactive version of Alex Alexandrescu's resume.
Your ONLY purpose is to answer questions about Alex's professional background using the provided Resume Context.

STRICT RULES:
1. Answer ONLY using the information in the Resume Context below.
2. If the answer is not in the context, state "I don't have that information in the resume."
3. DO NOT use outside knowledge or hallucinate capabilities (e.g. do not say you can help with recruiting or job postings).
4. If asked "what can you do" or "who are you", reply EXACTLY: "I can answer specific questions about Alex's experience, skills, and projects based on his resume."
5. You must cite relevant sections using ONLY these exact keys: ["experience", "skills", "projects", "personal"].
6. Format your response exactly as requested.
7. If the user says "Hi", "Hello", or similar greetings, reply politely and briefly, then invite them to ask about the resume.
8. DO NOT prefix your answer with "Answer:". Start directly with the response text.

Resume Context:
${this.resumeContext}

Format your response as:
[Your answer here]

Sections: ["section1", "section2"]`;

    const userPrompt = `Question: ${question}\n\nAnswer the question and identify relevant sections.`;

    let fullResponse = '';
    let sections: Array<'experience' | 'skills' | 'projects' | 'personal'> = [];

    try {
      const response = await this.engine.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        stream: true,
      });

      for await (const chunk of response) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullResponse += content;
          if (onChunk) {
            onChunk(content);
          }
          yield content;
        }
      }

      // Parse sections from response
      sections = this.parseSections(fullResponse);

      return {
        answer: this.cleanAnswer(fullResponse),
        sections,
      };
    } catch (error) {
      throw new Error(
        `Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Parse section references from LLM response
   */
  private parseSections(
    response: string
  ): Array<'experience' | 'skills' | 'projects' | 'personal'> {
    const validSections: Array<'experience' | 'skills' | 'projects' | 'personal'> = [
      'experience',
      'skills',
      'projects',
      'personal',
    ];
    let sections: Array<'experience' | 'skills' | 'projects' | 'personal'> = [];

    // FIX: Robust JSON parsing
    // Try to find the 'Sections: ["..."]' part
    const sectionsMatch = response.match(/Sections:\s*(\[.*?\])/is);

    if (sectionsMatch?.[1]) {
      const jsonString = sectionsMatch[1];
      try {
        const parsedArray = JSON.parse(jsonString) as unknown;

        if (Array.isArray(parsedArray)) {
          // Filter the parsed array to ensure all elements are valid section keys
          sections = parsedArray.filter(
            (s): s is (typeof validSections)[number] =>
              typeof s === 'string' && validSections.includes(s as (typeof validSections)[number])
          );
        }
      } catch (_e) {
        // Parsing failed, proceed to keyword matching fallback
      }
    }

    // Fallback: keyword matching (only runs if JSON parsing did not find valid sections)
    if (sections.length === 0) {
      const lowerResponse = response.toLowerCase();
      if (
        lowerResponse.includes('experience') ||
        lowerResponse.includes('work') ||
        lowerResponse.includes('job')
      ) {
        sections.push('experience');
      }
      if (
        lowerResponse.includes('skill') ||
        lowerResponse.includes('technology') ||
        lowerResponse.includes('tech')
      ) {
        sections.push('skills');
      }
      if (lowerResponse.includes('project')) {
        sections.push('projects');
      }
      if (
        lowerResponse.includes('education') ||
        lowerResponse.includes('volunteer') ||
        lowerResponse.includes('personal')
      ) {
        sections.push('personal');
      }
    }

    return [...new Set(sections)]; // Remove duplicates
  }

  /**
   * Clean the answer by removing section markers
   */
  private cleanAnswer(answer: string): string {
    // Remove 'Sections: [...]' or standalone JSON array at the end if present
    // The s flag is important for the dot to match newlines
    return answer
      .replace(/^Answer:\s*/i, '') // Remove "Answer:" prefix if present
      .replace(/\s*Sections:\s*\[.*?\]\s*$/is, '')
      .replace(/\s*\[.*?\]\s*$/s, '')
      .trim();
  }

  /**
   * Dispose of the engine
   */
  dispose(): void {
    // MLC Web-LLM does not expose a public synchronous dispose method,
    // but nullifying the reference helps garbage collection.
    this.engine = null;
    this.isLoading = false;
  }
}
