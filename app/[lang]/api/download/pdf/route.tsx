import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';
import { ProfilePDF } from '@/components/pdf/ProfilePDF';
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

    // Generate PDF stream
    const stream = await renderToStream(<ProfilePDF content={content} />);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    // Return PDF with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${content.profile.name.replace(/\s/g, '_')}_Profile.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
