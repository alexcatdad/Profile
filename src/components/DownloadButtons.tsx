'use client';

import { Download, FileCode2, FileText, Loader2, Sparkles, X } from 'lucide-react';
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

    // Start download in background - don't await, let it run async
    (async () => {
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
      }
    })();
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <output className="sr-only" aria-live="polite">
        {statusMessage}
      </output>

      <div
        className={`absolute bottom-20 right-0 flex flex-col gap-3 transition-all duration-200 ${
          isOpen ? 'opacity-100 translate-y-0' : 'pointer-events-none opacity-0 translate-y-5'
        }`}
      >
        {isOpen && activeRoleLabel && (
          <output
            className="glass-subtle flex items-center gap-2 rounded-2xl border border-border px-4 py-2 text-xs font-semibold text-foreground shadow-apple dark:border-white/10 dark:text-zinc-200"
            aria-live="polite"
          >
            <Sparkles className="h-4 w-4 text-accent dark:text-[#45caff]" />
            Focused for {activeRoleLabel}
          </output>
        )}
        {isOpen && (
          <>
            <button
              type="button"
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading !== null}
              className="group relative flex items-center gap-3 px-5 py-3 glass rounded-2xl border border-border transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-x-1 hover:scale-[1.01] hover:border-primary/60 shadow-apple dark:border-white/10 dark:hover:border-[#ff47c0]/60"
              aria-busy={isDownloading === 'pdf'}
            >
              <span className="text-sm font-bold text-foreground whitespace-nowrap dark:text-zinc-100">
                {isDownloading === 'pdf' ? 'Generating...' : 'Download PDF'}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff47c0] via-[#b04bff] to-[#45caff] shadow-lg">
                {isDownloading === 'pdf' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <FileText className="w-5 h-5 text-white" />
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDownload('markdown')}
              disabled={isDownloading !== null}
              className="group relative flex items-center gap-3 px-5 py-3 glass rounded-2xl border border-border transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 hover:-translate-x-1 hover:scale-[1.01] hover:border-accent/60 shadow-apple dark:border-white/10 dark:hover:border-[#45caff]/60"
              aria-busy={isDownloading === 'markdown'}
            >
              <span className="text-sm font-bold text-foreground whitespace-nowrap dark:text-zinc-100">
                {isDownloading === 'markdown' ? 'Generating...' : 'Download Markdown'}
              </span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#45caff] via-[#7c6bff] to-[#ff47c0] shadow-lg">
                {isDownloading === 'markdown' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <FileCode2 className="w-5 h-5 text-white" />
                )}
              </div>
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isDownloading !== null}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#ff47c0] via-[#b04bff] to-[#45caff] transition-all duration-300 shadow-apple-lg hover:shadow-[0_20px_50px_rgba(255,71,192,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ff47c0]/40 disabled:cursor-not-allowed disabled:opacity-50"
        style={{ transform: `rotate(${isOpen ? 180 : 0}deg)` }}
        aria-label={isOpen ? 'Close download menu' : 'Open download menu'}
        aria-expanded={isOpen}
        aria-busy={isDownloading !== null}
      >
        {isDownloading !== null ? (
          <Loader2 className="w-6 h-6 animate-spin text-white" />
        ) : isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Download className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}
