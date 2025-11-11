'use client';

import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Eye, Heart, Mic, Video, FileText } from 'lucide-react';
import type { Publication } from '@/types/content';

interface PublicationsSectionProps {
  publications: Publication[];
}

const getTypeIcon = (type: Publication['type']) => {
  switch (type) {
    case 'article':
      return <FileText className="w-5 h-5" />;
    case 'talk':
      return <Mic className="w-5 h-5" />;
    case 'video':
      return <Video className="w-5 h-5" />;
    case 'podcast':
      return <Mic className="w-5 h-5" />;
    case 'book':
      return <BookOpen className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const getTypeLabel = (type: Publication['type']) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const getTypeColor = (type: Publication['type']) => {
  switch (type) {
    case 'article':
      return 'from-blue-500 to-cyan-600';
    case 'talk':
      return 'from-purple-500 to-pink-600';
    case 'video':
      return 'from-red-500 to-orange-600';
    case 'podcast':
      return 'from-green-500 to-emerald-600';
    case 'book':
      return 'from-yellow-500 to-orange-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

export function PublicationsSection({ publications }: PublicationsSectionProps) {
  if (!publications || publications.length === 0) {
    return null;
  }

  const totalViews = publications.reduce((sum, pub) => sum + (pub.views || 0), 0);
  const totalLikes = publications.reduce((sum, pub) => sum + (pub.likes || 0), 0);

  return (
    <section
      id="publications"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8"
      aria-labelledby="publications-heading"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            id="publications-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Publications & Talks
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            Sharing knowledge through articles, conference talks, and technical content
          </p>

          {/* Engagement Stats */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <span className="font-semibold">
                {totalViews.toLocaleString()} views
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-semibold">
                {totalLikes.toLocaleString()} likes
              </span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          {publications.map((publication, index) => (
            <motion.article
              key={publication.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-strong p-6 sm:p-8 rounded-3xl shadow-apple hover:shadow-apple-lg transition-all duration-300 group hover:translate-x-2"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Type Icon */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${getTypeColor(
                    publication.type
                  )}/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  aria-hidden="true"
                >
                  <div
                    className={`text-transparent bg-gradient-to-r ${getTypeColor(
                      publication.type
                    )} bg-clip-text`}
                  >
                    {getTypeIcon(publication.type)}
                  </div>
                </div>

                <div className="flex-1 space-y-3">
                  {/* Title and Type */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getTypeColor(
                          publication.type
                        )} text-white`}
                      >
                        {getTypeLabel(publication.type)}
                      </span>
                      {publication.views && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          {publication.views.toLocaleString()}
                        </span>
                      )}
                      {publication.likes && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="w-3 h-3" />
                          {publication.likes.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {publication.url ? (
                        <a
                          href={publication.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors inline-flex items-center gap-2 group/link"
                        >
                          {publication.title}
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        publication.title
                      )}
                    </h3>
                  </div>

                  {/* Publisher and Date */}
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-semibold text-primary">
                      {publication.publisher}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <time className="text-muted-foreground" dateTime={publication.date}>
                      {new Date(publication.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </time>
                  </div>

                  {/* Description */}
                  {publication.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {publication.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
