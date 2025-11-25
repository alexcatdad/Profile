import { NextResponse } from 'next/server';
import { loadResume } from '@/lib/content-loader';
import { buildDownloadFileName } from '@/lib/download-utils';
import { generateMarkdown } from '@/lib/markdown-export';
import { filterResumeByRole, getRoleFromSearchParams } from '@/lib/role-filter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let resume = await loadResume();

    // Apply role-based filtering if role parameter is present
    const role = getRoleFromSearchParams(Object.fromEntries(searchParams));
    if (role !== 'all') {
      resume = filterResumeByRole(resume, role);
    }

    // Generate markdown
    const markdown = generateMarkdown(resume);

    const filename = buildDownloadFileName({
      basics: resume.basics,
      targetRoles: resume._custom?.targetRoles,
      role,
      format: 'markdown',
    });

    // Return markdown with proper headers
    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Markdown generation error:', error);
    return NextResponse.json({ error: 'Failed to generate Markdown' }, { status: 500 });
  }
}
