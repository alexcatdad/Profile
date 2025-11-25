'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Download, FileCode2, FileText, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { buildDownloadFileName } from '@/lib/download-utils';
import { getRoleFromSearchParams } from '@/lib/role-filter';
import type { Basics, CustomExtensions } from '@/types/json-resume';

interface DownloadButtonsProps {
  basics?: Basics;
  targetRoles?: CustomExtensions['targetRoles'];
}

export function DownloadButtons({ basics, targetRoles }: DownloadButtonsProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<'pdf' | 'markdown' | null>(null);
  const [activeRoleLabel, setActiveRoleLabel] = useState<string | null>(null);
  const statusMessage = isDownloading
    ? `Preparing ${isDownloading === 'pdf' ? 'PDF' : 'Markdown'} download`
    : isOpen
      ? 'Download menu expanded'
      : 'Download menu collapsed';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const role = getRoleFromSearchParams(params);
    if (role !== 'all') {
      const label = targetRoles?.[role]?.label ?? role.replace(/-/g, ' ');
      setActiveRoleLabel(label);
    } else {
      setActiveRoleLabel(null);
    }
  }, [targetRoles]);

  const handleDownload = async (format: 'pdf' | 'markdown') => {
    setIsDownloading(format);

    try {
      const pathParts = window.location.pathname.split('/');
      const lang = pathParts[1] || 'en';
      const response = await fetch(`/${lang}/api/download/${format}${window.location.search}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const role = getRoleFromSearchParams(new URLSearchParams(window.location.search));
      a.download = buildDownloadFileName({
        basics,
        targetRoles,
        role,
        format,
      });
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setIsDownloading(null);
      setIsOpen(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <output className="sr-only" aria-live="polite">
        {statusMessage}
      </output>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0 flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {activeRoleLabel && (
              <output
                className="glass-subtle flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-200 shadow-apple"
                aria-live="polite"
              >
                <Sparkles className="h-4 w-4 text-[#45caff]" />
                Focused for {activeRoleLabel}
              </output>
            )}
            <motion.button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading !== null}
              className="group relative flex items-center gap-3 px-5 py-3 glass rounded-2xl border border-white/10 hover:border-[#ff47c0]/60 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 shadow-apple"
              aria-busy={isDownloading === 'pdf'}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-bold text-zinc-100 whitespace-nowrap">
                {isDownloading === 'pdf' ? 'Generating...' : 'Download PDF'}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff47c0] via-[#b04bff] to-[#45caff] shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </motion.button>

            <motion.button
              onClick={() => handleDownload('markdown')}
              disabled={isDownloading !== null}
              className="group relative flex items-center gap-3 px-5 py-3 glass rounded-2xl border border-white/10 hover:border-[#45caff]/60 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 shadow-apple"
              aria-busy={isDownloading === 'markdown'}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-bold text-zinc-100 whitespace-nowrap">
                {isDownloading === 'markdown' ? 'Generating...' : 'Download Markdown'}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#45caff] via-[#7c6bff] to-[#ff47c0] shadow-lg">
                <FileCode2 className="w-5 h-5 text-white" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff47c0] via-[#b04bff] to-[#45caff] transition-all duration-300 shadow-apple-lg hover:shadow-[0_20px_50px_rgba(255,71,192,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ff47c0]/40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        aria-label={isOpen ? 'Close download menu' : 'Open download menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Download className="w-6 h-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}
