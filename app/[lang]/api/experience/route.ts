import { NextRequest, NextResponse } from 'next/server';
import { loadContent } from '@/lib/content-loader';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const technology = searchParams.get('technology');
    const company = searchParams.get('company');

    const content = await loadContent();
    const experience = content.experience;

    // Filter by technology
    if (technology) {
      const searchTerm = technology.toLowerCase();
      const relevantExperience = experience.filter((job) =>
        job.technologies.some((tech) => tech.toLowerCase().includes(searchTerm))
      );

      if (relevantExperience.length > 0) {
        // Calculate total years with this technology
        let totalYears = 0;
        relevantExperience.forEach((job) => {
          const start = new Date(job.startDate);
          const end = job.endDate ? new Date(job.endDate) : new Date();
          const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
          totalYears += years;
        });

        return NextResponse.json({
          technology: technology,
          yearsOfExperience: Math.round(totalYears * 10) / 10,
          positions: relevantExperience.length,
          experience: relevantExperience.map((job) => ({
            company: job.company,
            position: job.position,
            startDate: job.startDate,
            endDate: job.endDate,
            current: job.current,
            description: job.description,
            achievements: job.achievements,
          })),
        });
      }

      return NextResponse.json({
        technology: technology,
        found: false,
        message: `No experience found with ${technology}`,
      });
    }

    // Filter by company
    if (company) {
      const searchTerm = company.toLowerCase();
      const companyExperience = experience.find((job) =>
        job.company.toLowerCase().includes(searchTerm)
      );

      if (companyExperience) {
        return NextResponse.json({
          company: companyExperience.company,
          position: companyExperience.position,
          location: companyExperience.location,
          startDate: companyExperience.startDate,
          endDate: companyExperience.endDate,
          current: companyExperience.current,
          description: companyExperience.description,
          technologies: companyExperience.technologies,
          achievements: companyExperience.achievements,
          teamSize: companyExperience.teamSize,
        });
      }

      return NextResponse.json({
        company: company,
        found: false,
        message: `No experience found at ${company}`,
      });
    }

    // Return all experience summary
    const totalYears =
      content.profile.yearsOfExperience ||
      experience.reduce((sum, job) => {
        const start = new Date(job.startDate);
        const end = job.endDate ? new Date(job.endDate) : new Date();
        const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
        return sum + years;
      }, 0);

    return NextResponse.json({
      totalYearsOfExperience: Math.round(totalYears * 10) / 10,
      totalPositions: experience.length,
      currentPosition: experience.find((job) => job.current),
      companies: experience.map((job) => job.company),
      experience: experience.map((job) => ({
        company: job.company,
        position: job.position,
        startDate: job.startDate,
        endDate: job.endDate,
        current: job.current,
        technologies: job.technologies,
      })),
    });
  } catch (error) {
    console.error('Experience API error:', error);
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}
