import type { Skill, WorkExperience } from '@/types/content';

interface SkillWithExperience extends Skill {
  yearsOfExperience: number;
}

/**
 * Calculate years of experience for each skill based on work experience
 * Handles overlapping periods correctly by merging date ranges
 */
function parseDate(dateStr: string): Date {
  const [year, month] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

function monthsBetween(start: Date, end: Date): number {
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  return years * 12 + months + 1; // +1 to include both start and end months
}

function mergeDateRanges(
  ranges: Array<{ start: Date; end: Date }>
): Array<{ start: Date; end: Date }> {
  if (ranges.length === 0) return [];

  // Sort by start date
  const sorted = [...ranges].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged: Array<{ start: Date; end: Date }> = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    // If current range overlaps or is adjacent to last range, merge them
    if (current.start <= last.end) {
      last.end = current.end > last.end ? current.end : last.end;
    } else {
      merged.push(current);
    }
  }

  return merged;
}

/**
 * Calculate total years of experience for a skill across all work experiences
 */
export function calculateSkillExperience(skillName: string, experiences: WorkExperience[]): number {
  const dateRanges: Array<{ start: Date; end: Date }> = [];
  const now = new Date();

  for (const exp of experiences) {
    // Check if this skill was used in this experience
    if (exp.technologies.some((tech) => tech.toLowerCase() === skillName.toLowerCase())) {
      const start = parseDate(exp.startDate);
      const end = exp.current || !exp.endDate ? now : parseDate(exp.endDate);

      dateRanges.push({ start, end });
    }
  }

  if (dateRanges.length === 0) {
    return 0;
  }

  // Merge overlapping date ranges
  const merged = mergeDateRanges(dateRanges);

  // Calculate total months
  const totalMonths = merged.reduce((sum, range) => {
    return sum + monthsBetween(range.start, range.end);
  }, 0);

  // Convert to years with 1 decimal precision
  return Math.round((totalMonths / 12) * 10) / 10;
}

/**
 * Enrich skills with calculated years of experience
 */
export function enrichSkillsWithExperience(
  skills: Skill[],
  experiences: WorkExperience[]
): SkillWithExperience[] {
  return skills.map((skill) => ({
    ...skill,
    yearsOfExperience: calculateSkillExperience(skill.name, experiences),
  }));
}
