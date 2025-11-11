import { NextResponse } from 'next/server';
import { loadContent } from '@/lib/content-loader';

export async function GET() {
  try {
    const content = await loadContent();

    // Prepare chatbot-friendly summary
    const summary = {
      personal: {
        name: content.profile.name,
        title: content.profile.title,
        location: content.profile.location,
        yearsOfExperience: content.profile.yearsOfExperience,
        tagline: content.profile.tagline,
        summary: content.profile.summary,
      },
      skills: {
        total: content.skills.length,
        expert: content.skills.filter((s) => s.level === 'expert').map((s) => s.name),
        categories: Array.from(new Set(content.skills.map((s) => s.category))),
      },
      experience: {
        totalPositions: content.experience.length,
        currentCompany: content.experience.find((e) => e.current)?.company,
        currentPosition: content.experience.find((e) => e.current)?.position,
        companies: content.experience.map((e) => e.company),
      },
      projects: {
        total: content.projects.length,
        featured: content.projects.filter((p) => p.featured),
        openSource: content.projects.filter((p) => p.githubUrl),
      },
      achievements: content.achievements?.length || 0,
      publications: content.publications?.length || 0,
      awards: content.awards?.length || 0,
      certifications: content.certifications.length,
      education: content.education.map((e) => ({
        degree: e.degree,
        field: e.field,
        institution: e.institution,
      })),
      metrics: content.metrics,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
