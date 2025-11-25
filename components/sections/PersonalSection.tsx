import type { Certificate, Education, Interest, Language, Volunteer } from '@/types/json-resume';

interface PersonalSectionProps {
  volunteer?: Volunteer[];
  interests?: Interest[];
  education?: Education[];
  languages?: Language[];
  certificates?: Certificate[];
  formatDate: (date?: string) => string;
}

export function PersonalSection({
  volunteer,
  interests,
  education,
  languages,
  certificates,
  formatDate,
}: PersonalSectionProps) {
  return (
    <>
      {/* Volunteer */}
      {volunteer && volunteer.length > 0 && (
        <section className="interactive-card mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-apple">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
            <span className="text-[#ff47c0]">▸</span> Volunteer
          </h2>
          <div className="space-y-4">
            {volunteer.map((v, i) => (
              <article
                key={`${v.organization}-${i}`}
                className="hover-lift rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    {v.position && (
                      <h3 className="text-lg font-semibold text-white">{v.position}</h3>
                    )}
                    {v.organization && <p className="text-sm text-[#45caff]">{v.organization}</p>}
                  </div>
                  <span className="text-sm text-zinc-400">
                    {formatDate(v.startDate)} – {formatDate(v.endDate)}
                  </span>
                </div>
                {v.summary && <p className="mt-2 text-sm text-zinc-300">{v.summary}</p>}
                {v.highlights && v.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-zinc-300">
                    {v.highlights.map((h) => (
                      <li key={h}>• {h}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Interests */}
      {interests && interests.length > 0 && (
        <section className="interactive-card mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-apple">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
            <span className="text-[#ff47c0]">▸</span> Interests
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {interests.map((int, i) => (
              <article
                key={`${int.name}-${i}`}
                className="hover-lift rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                {int.name && <h3 className="mb-2 text-lg font-semibold text-white">{int.name}</h3>}
                {int.keywords && int.keywords.length > 0 && (
                  <ul className="space-y-1 text-sm text-zinc-300">
                    {int.keywords.map((kw) => (
                      <li key={kw}>{kw}</li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Education & Languages */}
      {(education || languages || certificates) && (
        <section className="interactive-card mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-apple">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
            <span className="text-[#ff47c0]">▸</span> Education & Languages
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {education && education.length > 0 && (
              <div className="hover-lift rounded-2xl border border-white/10 bg-black/30 p-5">
                {education.map((edu, i) => (
                  <div
                    key={`${edu.institution}-${i}`}
                    className={i > 0 ? 'mt-4 border-t border-white/10 pt-4' : ''}
                  >
                    {edu.studyType && (
                      <h3 className="text-lg font-semibold text-white">{edu.studyType}</h3>
                    )}
                    {edu.institution && <p className="text-sm text-[#45caff]">{edu.institution}</p>}
                    {edu.area && (
                      <p className="text-sm text-zinc-400">
                        {edu.area}
                        {edu.endDate && ` · ${edu.endDate.split('-')[0]}`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="hover-lift rounded-2xl border border-white/10 bg-black/30 p-5">
              {languages && languages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white">Languages</h3>
                  <div className="mt-3 flex flex-col gap-2">
                    {languages.map((lang, i) => (
                      <span key={`${lang.language}-${i}`} className="text-sm text-zinc-300">
                        {lang.language}{' '}
                        {lang.fluency && (
                          <span className="text-xs text-zinc-400">({lang.fluency})</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {certificates && certificates.length > 0 && (
                <div
                  className={
                    languages && languages.length > 0 ? 'mt-4 border-t border-white/10 pt-4' : ''
                  }
                >
                  <h3 className="text-lg font-semibold text-white">Certificates</h3>
                  <ul className="mt-2 space-y-2 text-sm text-zinc-300">
                    {certificates.map((cert, i) => (
                      <li key={`${cert.name}-${i}`}>
                        {cert.name}
                        {cert.issuer && <span className="text-zinc-500"> · {cert.issuer}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
