import type { JSONResume } from '@/types/json-resume';

/**
 * Loads the JSON Resume from the artifacts folder
 */
export async function loadResume(): Promise<JSONResume> {
  try {
    const resumeData = await import('@/artifacts/alex_alexandrescu_master_resume.json');
    return resumeData.default as JSONResume;
  } catch (error) {
    console.error('Failed to load resume:', error);
    throw new Error('Failed to load resume data');
  }
}

/**
 * Legacy function name for backward compatibility
 * @deprecated Use loadResume() instead
 */
export async function loadContent() {
  return loadResume();
}
