import { NextResponse } from 'next/server';
import { loadContent } from '@/lib/content-loader';

export async function GET() {
  try {
    const content = await loadContent();
    const basics = content.basics;
    const custom = content._custom;

    // Prepare chatbot-friendly summary
    const summary = {
      personal: {
        name: basics?.name,
        title: basics?.label,
        location: basics?.location
          ? `${basics.location.city}, ${basics.location.countryCode}`
          : undefined,
        yearsOfExperience: custom?.quantifiableMetrics?.yearsExperience,
        tagline: custom?.tagline,
        summary: basics?.summary,
      },
      skills: {
        total: content.skills?.length || 0,
        expert: content.skills
          ?.filter((s) => s.level?.toLowerCase().includes('expert'))
          .map((s) => s.name),
        categories: content.skills?.map((s) => s.name) || [],
      },
      experience: {
        totalPositions: content.work?.length || 0,
        currentCompany: content.work?.find((e) => !e.endDate)?.name,
        currentPosition: content.work?.find((e) => !e.endDate)?.position,
        companies: content.work?.map((e) => e.name) || [],
      },
      projects: {
        total: content.projects?.length || 0,
        featured: content.projects?.slice(0, 3).map((p) => p.name),
        openSource: content.projects?.filter((p) => p.url?.includes('github')).map((p) => p.name),
      },
      achievements: custom?.keyAchievements?.length || 0,
      publications: content.publications?.length || 0,
      awards: content.awards?.length || 0,
      certifications: content.certificates?.length || 0,
      education:
        content.education?.map((e) => ({
          degree: e.studyType,
          field: e.area,
          institution: e.institution,
        })) || [],
      metrics: custom?.quantifiableMetrics,
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
