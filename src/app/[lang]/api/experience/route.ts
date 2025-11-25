import { type NextRequest, NextResponse } from 'next/server';
import { loadContent } from '@/lib/content-loader';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const technology = searchParams.get('technology');
    const company = searchParams.get('company');

    const content = await loadContent();
    const experience = content.work || [];

    // Filter by technology
    if (technology) {
      const searchTerm = technology.toLowerCase();
      const relevantExperience = experience.filter((job) =>
        job.keywords?.some((tech) => tech.toLowerCase().includes(searchTerm))
      );

      if (relevantExperience.length > 0) {
        // Calculate total years with this technology
        let totalYears = 0;
        relevantExperience.forEach((job) => {
          if (!job.startDate) return;
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
            company: job.name,
            position: job.position,
            startDate: job.startDate,
            endDate: job.endDate,
            current: !job.endDate,
            description: job.summary,
            highlights: job.highlights,
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
        job.name?.toLowerCase().includes(searchTerm)
      );

      if (companyExperience) {
        return NextResponse.json({
          company: companyExperience.name,
          position: companyExperience.position,
          location: companyExperience.location,
          startDate: companyExperience.startDate,
          endDate: companyExperience.endDate,
          current: !companyExperience.endDate,
          description: companyExperience.summary,
          keywords: companyExperience.keywords,
          highlights: companyExperience.highlights,
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
    const totalYears = experience.reduce((sum, job) => {
      if (!job.startDate) return sum;
      const start = new Date(job.startDate);
      const end = job.endDate ? new Date(job.endDate) : new Date();
      const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
      return sum + years;
    }, 0);

    return NextResponse.json({
      totalYearsOfExperience: Math.round(totalYears * 10) / 10,
      totalPositions: experience.length,
      currentPosition: experience.find((job) => !job.endDate),
      companies: experience.map((job) => job.name),
      experience: experience.map((job) => ({
        company: job.name,
        position: job.position,
        startDate: job.startDate,
        endDate: job.endDate,
        current: !job.endDate,
        keywords: job.keywords,
      })),
    });
  } catch (error) {
    console.error('Experience API error:', error);
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}
