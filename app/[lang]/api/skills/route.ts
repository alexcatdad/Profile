import { NextRequest, NextResponse } from 'next/server';
import { loadContent } from '@/lib/content-loader';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const technology = searchParams.get('technology');

    const content = await loadContent();
    const skills = content.skills;
    const experience = content.experience;

    // If querying for a specific skill/technology
    if (query || technology) {
      const searchTerm = (query || technology || '').toLowerCase();
      const matchedSkill = skills.find(
        (skill) => skill.name.toLowerCase() === searchTerm
      );

      if (matchedSkill) {
        // Calculate years of experience from work history
        let yearsFromExperience = 0;
        experience.forEach((job) => {
          if (job.technologies.some((tech) => tech.toLowerCase() === searchTerm)) {
            const start = new Date(job.startDate);
            const end = job.endDate ? new Date(job.endDate) : new Date();
            const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
            yearsFromExperience += years;
          }
        });

        return NextResponse.json({
          skill: matchedSkill.name,
          yearsOfExperience:
            matchedSkill.yearsOfExperience || Math.round(yearsFromExperience * 10) / 10,
          level: matchedSkill.level,
          proficiency: matchedSkill.proficiency,
          category: matchedSkill.category,
          lastUsed: matchedSkill.lastUsed,
          highlighted: matchedSkill.highlighted,
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
      totalSkills: skills.length,
      categories: Array.from(new Set(skills.map((s) => s.category))),
      expertSkills: skills.filter((s) => s.level === 'expert').map((s) => s.name),
      highlightedSkills: skills.filter((s) => s.highlighted).map((s) => s.name),
      skills: skills.map((s) => ({
        name: s.name,
        yearsOfExperience: s.yearsOfExperience,
        level: s.level,
        category: s.category,
      })),
    });
  } catch (error) {
    console.error('Skills API error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}
