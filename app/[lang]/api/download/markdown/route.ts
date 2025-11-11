import { NextResponse } from 'next/server';
import { generateMarkdown } from '@/lib/markdown-export';
import { loadContent } from '@/lib/content-loader';
import { filterContentByRole, getRoleFromSearchParams } from '@/lib/role-filter';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let content = await loadContent();

    // Apply role-based filtering if role parameter is present
    const role = getRoleFromSearchParams(Object.fromEntries(searchParams));
    if (role !== 'all') {
      content = filterContentByRole(content, role);
    }

    // Generate markdown
    const markdown = generateMarkdown(content);

    // Return markdown with proper headers
    return new NextResponse(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${content.profile.name.replace(/\s/g, '_')}_Profile.md"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Markdown generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate Markdown' },
      { status: 500 }
    );
  }
}
