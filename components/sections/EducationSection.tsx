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
    <section id="education" ref={ref} className="py-32 px-4 relative overflow-hidden bg-gradient-to-b from-transparent via-primary/5 to-transparent">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="px-6 py-2 glass rounded-full text-sm font-semibold text-primary shadow-apple">
              Academic Excellence
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            {dictionary.navigation.education}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
            Continuous learning and professional development
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{ y: -6 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              <div className="relative glass hover:glass-strong p-8 rounded-3xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-500 h-full">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl glass-subtle flex items-center justify-center flex-shrink-0 shadow-apple group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {edu.degree}
                    </h3>
                    <p className="text-lg font-semibold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{edu.institution}</p>
                    <p className="text-muted-foreground text-sm mb-3 font-medium">{edu.field}</p>
                    <div className="flex items-center gap-2 glass-subtle px-4 py-2 rounded-xl w-fit">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold">
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: (education.length + index) * 0.15,
                type: 'spring',
                stiffness: 100
              }}
              whileHover={{ y: -6 }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
              <div className="relative glass hover:glass-strong p-8 rounded-3xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-500 h-full">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl glass-subtle flex items-center justify-center flex-shrink-0 shadow-apple group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {cert.name}
                    </h3>
                    <p className="text-lg font-semibold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{cert.issuer}</p>
                    <div className="flex items-center gap-2 glass-subtle px-4 py-2 rounded-xl w-fit mb-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold">
                        Issued: {cert.issueDate}
                        {cert.expiryDate && ` • Expires: ${cert.expiryDate}`}
                      </span>
                    </div>
                    {cert.url && (
                      <motion.a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-accent text-sm font-semibold transition-colors group/link"
                        whileHover={{ x: 2 }}
                      >
                        <span>Verify credential</span>
                        <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
