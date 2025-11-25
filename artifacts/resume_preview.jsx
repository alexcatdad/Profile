import React, { useState } from 'react';

const resumeData = {
  "basics": {
    "name": "Alex Alexandrescu",
    "label": "Senior Software Engineer & Engineering Leader",
    "pronouns": "he/they",
    "email": "alex@escu.dev",
    "url": "https://github.com/alexcatdad",
    "summary": "Full-stack engineer and technical leader with 14+ years building web applications, leading distributed teams, and scaling startups. Deep expertise in TypeScript, Next.js, and React ecosystems. Founded and operated a software development agency specializing in Web3 technologies. Currently focused on AI-augmented development workflows, modern frontend architecture, and developer experience tooling. Author of '10 Years of Remote Work' (in progress). Open source contributor with a philosophy of extracting and sharing reusable solutions.",
    "profiles": [
      { "network": "LinkedIn", "username": "alexalexandrescu", "url": "https://linkedin.com/in/alexalexandrescu" },
      { "network": "GitHub", "username": "alexcatdad", "url": "https://github.com/alexcatdad" }
    ],
    "location": { "city": "Bucharest", "region": "Bucharest Metropolitan Area", "countryCode": "RO" }
  },
  "work": [
    {
      "name": "Conversy",
      "position": "Software Engineering Consultant",
      "startDate": "2023-01",
      "endDate": "",
      "summary": "Voice biometric analysis startup using ML for speaker identification and speech content analysis.",
      "highlights": [
        "Architected client-facing interface using Next.js, TypeScript, and Tailwind CSS",
        "Designed software architecture ensuring subsystem independence and separation of concerns",
        "Achieved 90% success rate on daily deployment cadence target"
      ],
      "teamSize": 3,
      "keywords": ["Next.js", "TypeScript", "Tailwind CSS", "Software Architecture", "ML/AI Integration"]
    },
    {
      "name": "Technically Correct",
      "position": "Founder & Lead Engineer",
      "startDate": "2021-09",
      "endDate": "2022-12",
      "summary": "Founded software development agency specializing in Web3 and modern web technologies.",
      "highlights": [
        "Built team of 4 internal engineers and 20 contractors",
        "Delivered 5 projects to production including RCKT, FANtium, and Conversy engagements",
        "Made responsible decision to wind down operations after Web3 market collapse"
      ],
      "teamSize": 24,
      "keywords": ["Agency Leadership", "Web3", "Next.js", "TypeScript", "Team Building"]
    },
    {
      "name": "RCKT",
      "position": "Senior Software Engineer",
      "startDate": "2021-11",
      "endDate": "2022-07",
      "summary": "Contract via Technically Correct. Berlin agency rebuilding oetker.com.",
      "highlights": [
        "Rebuilt oetker.com corporate web presence using Next.js and Tailwind CSS",
        "Established coding standards, automated testing frameworks, and CI/CD processes"
      ],
      "teamSize": 10,
      "keywords": ["Next.js", "Tailwind CSS", "CI/CD", "Testing"]
    },
    {
      "name": "FANtium",
      "position": "Technical Product Manager",
      "startDate": "2022-06",
      "endDate": "2023-01",
      "summary": "Sports technology startup. Hybrid technical and product role.",
      "highlights": [
        "Bridged engineering and product teams on feature prioritization",
        "Managed technical roadmap and quarterly delivery cycles"
      ],
      "teamSize": 4,
      "keywords": ["Product Management", "Technical Leadership", "Sports Tech"]
    },
    {
      "name": "Marley Spoon",
      "position": "Engineering Manager",
      "startDate": "2021-06",
      "endDate": "2021-10",
      "summary": "Meal kit delivery company. Led frontend architecture migration.",
      "highlights": [
        "Led team of 8 in frontend architecture migration from PHP to Next.js",
        "Implemented full CI/CD pipeline with automated testing and compliance validation",
        "Containerized frontend infrastructure using Kubernetes on AWS"
      ],
      "teamSize": 8,
      "keywords": ["Engineering Management", "Next.js", "TypeScript", "Kubernetes", "AWS"]
    },
    {
      "name": "MVP Match",
      "position": "Head of Technical Operations",
      "startDate": "2020-05",
      "endDate": "2021-06",
      "summary": "Berlin-based technical talent marketplace. Early team member.",
      "highlights": [
        "Built technical validation pipeline processing 310+ freelance profiles",
        "Achieved 65% client acceptance rate on vetted technical candidates",
        "Created domain expert program scaling technical vetting"
      ],
      "keywords": ["Technical Operations", "Talent Management", "Technical Recruiting"]
    },
    {
      "name": "ADAMOS",
      "position": "Engineering Manager",
      "startDate": "2019-01",
      "endDate": "2020-12",
      "summary": "Darmstadt-based IIoT company for manufacturing.",
      "highlights": [
        "Led team of 7 on greenfield IoT research and connection platform",
        "Built corporate identity, API contracts, and plugin marketplace from scratch"
      ],
      "teamSize": 7,
      "keywords": ["Engineering Management", "IIoT", "React", "Node.js", "Greenfield"]
    },
    {
      "name": "MVP Factory",
      "position": "Engineering Manager → Technical Lead",
      "startDate": "2017-08",
      "endDate": "2020-05",
      "summary": "Software development consultancy. Technical delivery and team scaling.",
      "highlights": [
        "Managed technical delivery for multiple concurrent client projects",
        "Scaled development teams building distributed senior JavaScript developer network",
        "Developed staff augmentation pipeline including recruitment and mentorship"
      ],
      "keywords": ["Engineering Management", "Technical Leadership", "JavaScript", "Team Building"]
    },
    {
      "name": "Stefanini EMEA",
      "position": "JavaScript Tech Lead",
      "startDate": "2016-10",
      "endDate": "2017-08",
      "summary": "Global IT services. Led JavaScript development across diverse client projects.",
      "highlights": [
        "Led JavaScript development across outsourcing engagements",
        "Delivered projects from legacy HTML to modern Angular 2 clients"
      ],
      "keywords": ["JavaScript", "Angular", "Technical Leadership"]
    },
    {
      "name": "Earlier Roles",
      "position": "Developer → Rich Media Engineer",
      "startDate": "2010-02",
      "endDate": "2016-10",
      "summary": "Talkbe, Teads Studio, eMAG, KUBIS, Stefanini Infinit, SIVECO Romania",
      "highlights": [
        "Built interactive video ads and mobile games (ITV, Dominos, John Lewis)",
        "Contributed to Vodafone.ro redesign",
        "Created one of Romania's most visited Facebook game campaigns"
      ],
      "keywords": ["JavaScript", "Angular", "Flash", "PHP", "Laravel"]
    }
  ],
  "skills": [
    { "name": "Languages & Frameworks", "level": "Expert", "keywords": ["TypeScript", "JavaScript", "React", "Next.js", "Node.js", "NestJS", "Tailwind CSS"] },
    { "name": "Architecture & Infrastructure", "level": "Advanced", "keywords": ["Turborepo", "Docker", "Kubernetes", "AWS", "Scaleway", "CI/CD", "GitHub Actions"] },
    { "name": "AI & Developer Tools", "level": "Intermediate", "keywords": ["AI-Augmented Development", "LLM Integration", "Claude Code", "Semantic Code Search"] },
    { "name": "Data & APIs", "level": "Advanced", "keywords": ["PostgreSQL", "MySQL", "MongoDB", "REST APIs", "GraphQL"] },
    { "name": "Leadership & Process", "level": "Expert", "keywords": ["Engineering Management", "Team Building", "Agile/Scrum", "Technical Recruiting", "Remote Teams"] }
  ],
  "projects": [
    { "name": "Terminal UI for React", "description": "React component library — terminal-style UI for web. Inverse of Ink.", "keywords": ["React", "TypeScript", "UI Library", "Open Source"] },
    { "name": "Open Source Philosophy", "description": "Extract and publish reusable, non-proprietary solutions from client projects.", "url": "https://github.com/alexcatdad" }
  ],
  "volunteer": [
    { "organization": "Cat Rescue Network", "position": "Rescue Volunteer", "startDate": "2022-01", "summary": "Transport, foster, socialize cats. Consult with adopters. Coordinate with veterinarians." }
  ],
  "publications": [
    { "name": "10 Years of Remote Work", "summary": "Book in research phase — personal experience vs. industry adoption patterns." }
  ],
  "interests": [
    { "name": "Photography", "keywords": ["Published photographer", "Boudoir/Glamour", "Studios in Bucharest & Berlin"] },
    { "name": "Vintage Car Mechanics", "keywords": ["BMW E46 Individual restoration", "Mitsubishi Lancer Ralliart resurrection"] },
    { "name": "Homelabbing", "keywords": ["TrueNAS Scale", "Self-hosted infrastructure", "Media servers"] }
  ],
  "education": [
    { "institution": "Titu Maiorescu University", "area": "Computer Science", "studyType": "Engineer's Degree", "endDate": "2012" }
  ],
  "languages": [
    { "language": "Romanian", "fluency": "Native" },
    { "language": "English", "fluency": "Fluent" }
  ]
};

export default function ResumePreview() {
  const [activeTab, setActiveTab] = useState('full');
  const { basics, work, skills, projects, volunteer, publications, interests, education, languages } = resumeData;

  const formatDate = (date) => {
    if (!date) return 'Present';
    const [year, month] = date.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return month ? `${months[parseInt(month) - 1]} ${year}` : year;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 pb-6 border-b border-zinc-800">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{basics.name}</h1>
              <p className="text-lg text-emerald-400 font-medium">{basics.label}</p>
              <p className="text-zinc-400 text-sm mt-1">{basics.location.city}, {basics.location.countryCode} · {basics.pronouns}</p>
            </div>
            <div className="flex flex-col gap-1 text-sm text-zinc-400">
              <a href={`mailto:${basics.email}`} className="hover:text-emerald-400 transition-colors">{basics.email}</a>
              {basics.profiles.map(p => (
                <a key={p.network} href={p.url} className="hover:text-emerald-400 transition-colors" target="_blank" rel="noopener noreferrer">
                  {p.network}: {p.username}
                </a>
              ))}
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['full', 'experience', 'skills', 'projects', 'personal'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Summary - shown on full and experience tabs */}
        {(activeTab === 'full' || activeTab === 'experience') && (
          <section className="mb-8">
            <p className="text-zinc-300 leading-relaxed">{basics.summary}</p>
          </section>
        )}

        {/* Skills */}
        {(activeTab === 'full' || activeTab === 'skills') && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-emerald-400">▸</span> Skills
            </h2>
            <div className="grid gap-4">
              {skills.map(skill => (
                <div key={skill.name} className="bg-zinc-900 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-zinc-200">{skill.name}</h3>
                    <span className="text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-400">{skill.level}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.keywords.map(kw => (
                      <span key={kw} className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-emerald-400">{kw}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {(activeTab === 'full' || activeTab === 'experience') && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-emerald-400">▸</span> Experience
            </h2>
            <div className="space-y-6">
              {work.map((job, i) => (
                <div key={i} className="bg-zinc-900 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{job.position}</h3>
                      <p className="text-emerald-400 text-sm">{job.name}</p>
                    </div>
                    <div className="text-sm text-zinc-500 md:text-right">
                      <div>{formatDate(job.startDate)} – {formatDate(job.endDate)}</div>
                      {job.teamSize && <div className="text-zinc-600">Team: {job.teamSize}</div>}
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm mb-3">{job.summary}</p>
                  {job.highlights && (
                    <ul className="space-y-1">
                      {job.highlights.map((h, j) => (
                        <li key={j} className="text-sm text-zinc-300 flex items-start gap-2">
                          <span className="text-emerald-600 mt-1">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {job.keywords && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {job.keywords.map(kw => (
                        <span key={kw} className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-zinc-500">{kw}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {(activeTab === 'full' || activeTab === 'projects') && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-emerald-400">▸</span> Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((proj, i) => (
                <div key={i} className="bg-zinc-900 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-1">{proj.name}</h3>
                  <p className="text-zinc-400 text-sm mb-2">{proj.description}</p>
                  {proj.keywords && (
                    <div className="flex flex-wrap gap-1">
                      {proj.keywords.map(kw => (
                        <span key={kw} className="text-xs px-2 py-0.5 bg-zinc-800 rounded text-emerald-400">{kw}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Publications */}
        {(activeTab === 'full' || activeTab === 'projects') && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-emerald-400">▸</span> Publications
            </h2>
            {publications.map((pub, i) => (
              <div key={i} className="bg-zinc-900 rounded-lg p-4">
                <h3 className="font-medium text-white mb-1">{pub.name}</h3>
                <p className="text-zinc-400 text-sm">{pub.summary}</p>
              </div>
            ))}
          </section>
        )}

        {/* Personal - Volunteer, Interests */}
        {(activeTab === 'full' || activeTab === 'personal') && (
          <>
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">▸</span> Volunteer
              </h2>
              {volunteer.map((v, i) => (
                <div key={i} className="bg-zinc-900 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-white">{v.position}</h3>
                      <p className="text-emerald-400 text-sm">{v.organization}</p>
                    </div>
                    <span className="text-sm text-zinc-500">{formatDate(v.startDate)} – Present</span>
                  </div>
                  <p className="text-zinc-400 text-sm mt-2">{v.summary}</p>
                </div>
              ))}
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">▸</span> Interests
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {interests.map((int, i) => (
                  <div key={i} className="bg-zinc-900 rounded-lg p-4">
                    <h3 className="font-medium text-white mb-2">{int.name}</h3>
                    <ul className="space-y-1">
                      {int.keywords.map((kw, j) => (
                        <li key={j} className="text-sm text-zinc-400">{kw}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-emerald-400">▸</span> Education & Languages
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-900 rounded-lg p-4">
                  <h3 className="font-medium text-white">{education[0].studyType}</h3>
                  <p className="text-emerald-400 text-sm">{education[0].institution}</p>
                  <p className="text-zinc-500 text-sm">{education[0].area} · {education[0].endDate}</p>
                </div>
                <div className="bg-zinc-900 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2">Languages</h3>
                  <div className="flex gap-4">
                    {languages.map((lang, i) => (
                      <div key={i}>
                        <span className="text-zinc-300">{lang.language}</span>
                        <span className="text-zinc-500 text-sm ml-1">({lang.fluency})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="text-center text-zinc-600 text-sm pt-4 border-t border-zinc-800">
          JSON Resume v1.0.0 · Last updated November 2025
        </footer>
      </div>
    </div>
  );
}
