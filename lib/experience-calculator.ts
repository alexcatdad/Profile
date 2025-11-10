import type { WorkExperience } from '@/types/content';

/**
 * Parse date string in YYYY-MM format to Date object
 */
function parseDate(dateStr: string): Date {
  const [year, month] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

/**
 * Calculate total years of professional experience across all work experiences
 * Handles overlapping periods correctly
 */
export function calculateTotalYearsOfExperience(experiences: WorkExperience[]): number {
  if (!experiences || experiences.length === 0) {
    return 0;
  }

  const now = new Date();
  const dateRanges: Array<{ start: Date; end: Date }> = [];

  // Collect all date ranges
  for (const exp of experiences) {
    if (!exp.startDate) {
      continue; // Skip invalid entries
    }
    const start = parseDate(exp.startDate);
    const end = exp.current || !exp.endDate ? now : parseDate(exp.endDate);

    // Ensure end is after start
    if (end < start) {
      continue; // Skip invalid date ranges
    }

    dateRanges.push({ start, end });
  }

  if (dateRanges.length === 0) {
    return 0;
  }

  // Sort by start date
  const sorted = [...dateRanges].sort((a, b) => a.start.getTime() - b.start.getTime());

  // Merge overlapping or adjacent ranges
  const merged: Array<{ start: Date; end: Date }> = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    // Check if ranges overlap or are adjacent (within 1 month)
    // Create a date 1 month after last.end to check adjacency
    const lastEndPlusOneMonth = new Date(last.end);
    lastEndPlusOneMonth.setMonth(lastEndPlusOneMonth.getMonth() + 1);

    if (current.start <= lastEndPlusOneMonth) {
      // Merge ranges - take the later end date
      last.end = current.end > last.end ? current.end : last.end;
    } else {
      // No overlap or adjacency, add as new range
      merged.push(current);
    }
  }

  // Calculate total months
  let totalMonths = 0;
  for (const range of merged) {
    const years = range.end.getFullYear() - range.start.getFullYear();
    const months = range.end.getMonth() - range.start.getMonth();
    totalMonths += years * 12 + months + 1; // +1 to include both start and end months
  }

  // Convert to years and round down to nearest integer
  return Math.floor(totalMonths / 12);
}
