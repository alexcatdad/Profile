import { type NextRequest, NextResponse } from 'next/server';
import { loadContent } from '@/lib/content-loader';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const technology = searchParams.get('technology');

    const content = await loadContent();
    const skillGroups = content.skills || [];
    const work = content.work || [];

    // Flatten skills for searching
    const allSkills = skillGroups.flatMap((group) =>
      (group.keywords || []).map((keyword) => ({
        name: keyword,
        category: group.name,
        level: group.level,
      }))
    );

    // If querying for a specific skill/technology
    if (query || technology) {
      const searchTerm = (query || technology || '').toLowerCase();
      const matchedSkill = allSkills.find((skill) => skill.name.toLowerCase() === searchTerm);

      if (matchedSkill) {
        // Calculate years of experience from work history
        let yearsFromExperience = 0;
        work.forEach((job) => {
          if (job.keywords?.some((tech) => tech.toLowerCase() === searchTerm) && job.startDate) {
            const start = new Date(job.startDate);
            const end = job.endDate ? new Date(job.endDate) : new Date();
            const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
            yearsFromExperience += years;
          }
        });

        return NextResponse.json({
          skill: matchedSkill.name,
          yearsOfExperience: Math.round(yearsFromExperience * 10) / 10,
          level: matchedSkill.level,
          category: matchedSkill.category,
          found: true,
        });
      }

      return NextResponse.json({
        skill: searchTerm,
        found: false,
        message: `No experience found with ${searchTerm}`,
      });
    }

    // Return all skills summary
    return NextResponse.json({
      totalSkills: allSkills.length,
      categories: skillGroups.map((s) => s.name),
      expertSkills: skillGroups
        .filter((s) => s.level?.toLowerCase().includes('expert'))
        .flatMap((s) => s.keywords || []),
      skills: allSkills.map((s) => ({
        name: s.name,
        level: s.level,
        category: s.category,
      })),
    });
  } catch (error) {
    console.error('Skills API error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}
