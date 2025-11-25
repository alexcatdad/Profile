import TurndownService from 'turndown';

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

/**
 * Fetches a job description from a URL and converts it to markdown
 */
export async function fetchJDAsMarkdown(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch JD: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const markdown = turndownService.turndown(html);

    // Clean up the markdown
    return cleanMarkdown(markdown);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error fetching JD from ${url}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Cleans up markdown by removing excessive whitespace and normalizing
 */
function cleanMarkdown(md: string): string {
  return (
    md
      // Remove excessive blank lines (more than 2 consecutive)
      .replace(/\n{3,}/g, '\n\n')
      // Trim each line
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      // Remove leading/trailing whitespace
      .trim()
  );
}

/**
 * Attempts to extract company name from URL or markdown content
 */
export function extractCompanyName(url: string, markdown: string): string | null {
  // Try to extract from URL first
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    // Common job board patterns
    if (hostname.includes('lever.co')) {
      const match = url.match(/https?:\/\/([^.]+)\.lever\.co/);
      if (match) return formatCompanyName(match[1]);
    }
    if (hostname.includes('greenhouse.io')) {
      const match = url.match(/https?:\/\/([^.]+)\.greenhouse\.io/);
      if (match) return formatCompanyName(match[1]);
    }
    if (hostname.includes('workable.com')) {
      const match = url.match(/https?:\/\/([^.]+)\.workable\.com/);
      if (match) return formatCompanyName(match[1]);
    }

    // Try to extract from markdown (look for "About [Company]" or similar patterns)
    const aboutMatch = markdown.match(/about\s+([A-Z][A-Za-z0-9\s&]+)/i);
    if (aboutMatch) return formatCompanyName(aboutMatch[1]);

    // Look for company name in headers
    const headerMatch = markdown.match(/^#+\s+([A-Z][A-Za-z0-9\s&]+)/m);
    if (headerMatch) return formatCompanyName(headerMatch[1]);
  } catch {
    // URL parsing failed, continue
  }

  return null;
}

function formatCompanyName(name: string): string {
  return name
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}
