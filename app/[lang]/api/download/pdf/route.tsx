import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';
import { ProfilePDF } from '@/components/pdf/ProfilePDF';
import { loadResume } from '@/lib/content-loader';
import { buildDownloadFileName } from '@/lib/download-utils';
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

    // Generate PDF stream
    const targetRoleLabel = role !== 'all' ? resume._custom?.targetRoles?.[role]?.label : undefined;

    const stream = await renderToStream(<ProfilePDF resume={resume} roleLabel={targetRoleLabel} />);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    const filename = buildDownloadFileName({
      basics: resume.basics,
      targetRoles: resume._custom?.targetRoles,
      role,
      format: 'pdf',
    });

    // Return PDF with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
