'use client';

import { motion, useInView } from 'framer-motion';
import { BookOpen, ExternalLink, Eye, Heart, Mic, Video, FileText, Pen } from 'lucide-react';
import { useRef } from 'react';
import type { Publication } from '@/types/content';

interface PublicationsSectionProps {
  publications: Publication[];
}

const getTypeIcon = (type: Publication['type']) => {
  switch (type) {
    case 'article':
      return <FileText className="w-4 h-4" />;
    case 'talk':
      return <Mic className="w-4 h-4" />;
    case 'video':
      return <Video className="w-4 h-4" />;
    case 'podcast':
      return <Mic className="w-4 h-4" />;
    case 'book':
      return <BookOpen className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getTypeLabel = (type: Publication['type']) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export function PublicationsSection({ publications }: PublicationsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  if (!publications || publications.length === 0) {
    return null;
  }

  return (
    <section
      id="publications"
      ref={ref}
      className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12"
      aria-labelledby="publications-heading"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-20 sm:mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-primary"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Pen className="w-4 h-4" />
            <span>Published Work</span>
          </motion.div>

          <h2
            id="publications-heading"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight"
          >
            <span className="gradient-text-hero">Publications & Talks</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Sharing knowledge through writing and speaking
          </motion.p>
        </motion.div>

        {/* Publications list */}
        <div className="space-y-8">
          {publications.map((publication, index) => (
            <motion.article
              key={publication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
              }}
            >
              <div className="space-y-3 p-6 glass-subtle rounded-2xl shadow-apple">
                {/* Type badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded-full text-xs font-semibold">
                  {getTypeIcon(publication.type)}
                  <span>{getTypeLabel(publication.type)}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-black">
                  {publication.url ? (
                    <a
                      href={publication.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors inline-flex items-center gap-2 group"
                    >
                      {publication.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    publication.title
                  )}
                </h3>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span>{publication.publisher}</span>
                  <span>·</span>
                  <span>{publication.date}</span>
                  {publication.views && (
                    <>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{publication.views.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                  {publication.likes && (
                    <>
                      <span>·</span>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{publication.likes.toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Description */}
                {publication.description && (
                  <p className="text-base text-muted-foreground leading-relaxed">
                    {publication.description}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
