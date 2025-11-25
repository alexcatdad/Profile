'use client';

import { CreateMLCEngine, type MLCEngineInterface } from '@mlc-ai/web-llm';
import type { JSONResume } from '@/types/json-resume';

export interface ResumeChatResponse {
  answer: string;
  sections: Array<'experience' | 'skills' | 'projects' | 'personal'>;
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

  constructor(private resume: JSONResume, options: WebLLMOptions = {}) {
    // MLC Web-LLM model ID - must match exactly from https://mlc.ai/models
    // Using smaller model that's more likely to be in default model list
    this.modelId = options.model || 'SmolLM2-360M-Instruct-q4f16_1-MLC';
    this.resumeContext = this.buildResumeContext(resume);
  }

  /**
   * Build a concise text representation of the resume for LLM context
   */
  private buildResumeContext(resume: JSONResume): string {
    const parts: string[] = [];

    if (resume.basics) {
      parts.push(`Name: ${resume.basics.name || 'N/A'}`);
      parts.push(`Title: ${resume.basics.label || 'N/A'}`);
      if (resume.basics.summary) {
        parts.push(`Summary: ${resume.basics.summary}`);
      }
    }

    if (resume.work && resume.work.length > 0) {
      parts.push('\nExperience:');
      resume.work.forEach((job) => {
        parts.push(`- ${job.position || 'N/A'} at ${job.name || 'N/A'}`);
        if (job.summary) parts.push(`  ${job.summary}`);
        if (job.highlights && job.highlights.length > 0) {
          job.highlights.slice(0, 3).forEach((h) => parts.push(`  • ${h}`));
        }
        if (job.keywords && job.keywords.length > 0) {
          parts.push(`  Skills: ${job.keywords.join(', ')}`);
        }
      });
    }

    if (resume.skills && resume.skills.length > 0) {
      parts.push('\nSkills:');
      resume.skills.forEach((skill) => {
        parts.push(`- ${skill.name || 'N/A'}: ${skill.level || 'N/A'}`);
        if (skill.keywords && skill.keywords.length > 0) {
          parts.push(`  ${skill.keywords.join(', ')}`);
        }
      });
    }

    if (resume.projects && resume.projects.length > 0) {
      parts.push('\nProjects:');
      resume.projects.forEach((project) => {
        parts.push(`- ${project.name || 'N/A'}`);
        if (project.description) parts.push(`  ${project.description}`);
        if (project.highlights && project.highlights.length > 0) {
          project.highlights.slice(0, 2).forEach((h) => parts.push(`  • ${h}`));
        }
      });
    }

    if (resume.education && resume.education.length > 0) {
      parts.push('\nEducation:');
      resume.education.forEach((edu) => {
        parts.push(`- ${edu.studyType || 'N/A'} in ${edu.area || 'N/A'} from ${edu.institution || 'N/A'}`);
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
      const engine = await CreateMLCEngine(
        {
          model: this.modelId, // FIX: Use the ID directly
        },
        {
          initProgressCallback: (report) => {
            if (onProgress) {
              const progress = report.progress / report.total;
              onProgress(progress, report.text || 'Loading model...');
            }
          },
        }
      );

      this.engine = engine;
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
      throw new Error(`Failed to initialize WebLLM: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
    const systemPrompt = `You are a helpful assistant that answers questions about Alex Alexandrescu's resume. 
When answering, identify which resume sections are relevant to the question. 
After your answer, list the relevant sections as a JSON array: ["experience", "skills", "projects", "personal"].

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
        temperature: 0.7,
        max_tokens: 1000,
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
      throw new Error(`Failed to generate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse section references from LLM response
   */
  private parseSections(response: string): Array<'experience' | 'skills' | 'projects' | 'personal'> {
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

    if (sectionsMatch && sectionsMatch[1]) {
      const jsonString = sectionsMatch[1];
      try {
        const parsedArray = JSON.parse(jsonString) as unknown;

        if (Array.isArray(parsedArray)) {
          // Filter the parsed array to ensure all elements are valid section keys
          sections = parsedArray.filter(
            (s): s is typeof validSections[number] =>
              typeof s === 'string' && validSections.includes(s as any)
          );
        }
      } catch (e) {
        // Parsing failed, proceed to keyword matching fallback
      }
    }

    // Fallback: keyword matching (only runs if JSON parsing did not find valid sections)
    if (sections.length === 0) {
      const lowerResponse = response.toLowerCase();
      if (lowerResponse.includes('experience') || lowerResponse.includes('work') || lowerResponse.includes('job')) {
        sections.push('experience');
      }
      if (lowerResponse.includes('skill') || lowerResponse.includes('technology') || lowerResponse.includes('tech')) {
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
    return answer.replace(/\s*Sections:\s*\[.*?\]\s*$/si, '').replace(/\s*\[.*?\]\s*$/s, '').trim();
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