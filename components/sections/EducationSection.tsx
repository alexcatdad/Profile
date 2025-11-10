'use client';

import { motion, useInView } from 'framer-motion';
import { Award, Calendar, ExternalLink, GraduationCap } from 'lucide-react';
import { useRef } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import type { Certification, Education } from '@/types/content';

interface EducationSectionProps {
  education: Education[];
  certifications: Certification[];
  dictionary: Dictionary;
}

export function EducationSection({ education, certifications, dictionary }: EducationSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  return (
    <section id="education" ref={ref} className="py-20 px-4 bg-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            {dictionary.navigation.education}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              className="group bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/50"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 text-card-foreground group-hover:text-primary transition-colors">
                    {edu.degree}
                  </h3>
                  <p className="text-lg text-primary font-semibold mb-1">{edu.institution}</p>
                  <p className="text-muted-foreground text-sm mb-2">{edu.field}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              className="group bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:border-primary/50"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: (education.length + index) * 0.15 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1 text-card-foreground group-hover:text-primary transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-lg text-primary font-semibold mb-2">{cert.issuer}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Issued: {cert.issueDate}
                      {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                    </span>
                  </div>
                  {cert.url && (
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 text-sm font-medium transition-colors group/link"
                    >
                      <span>Verify credential</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
