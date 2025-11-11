'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileText, FileCode2, X } from 'lucide-react';
import { useState } from 'react';

export function DownloadButtons() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState<'pdf' | 'markdown' | null>(null);

  const handleDownload = async (format: 'pdf' | 'markdown') => {
    setIsDownloading(format);

    try {
      const response = await fetch(`/api/download/${format}${window.location.search}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = format === 'pdf' ? 'Profile.pdf' : 'Profile.md';
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

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0 flex flex-col gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* PDF Download Button */}
            <motion.button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading !== null}
              className="group relative flex items-center gap-3 px-5 py-3 glass-strong rounded-xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-bold text-foreground whitespace-nowrap">
                {isDownloading === 'pdf' ? 'Generating...' : 'Download PDF'}
              </span>
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </motion.button>

            {/* Markdown Download Button */}
            <motion.button
              onClick={() => handleDownload('markdown')}
              disabled={isDownloading !== null}
              className="group relative flex items-center gap-3 px-5 py-3 glass-strong rounded-xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-bold text-foreground whitespace-nowrap">
                {isDownloading === 'markdown' ? 'Generating...' : 'Download Markdown'}
              </span>
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg">
                <FileCode2 className="w-5 h-5 text-white" />
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary via-accent to-primary rounded-full shadow-glow hover:shadow-glow-accent transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Download className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Tooltip */}
      {!isOpen && (
        <motion.div
          className="absolute bottom-20 right-0 px-4 py-2 glass-strong rounded-lg shadow-apple-lg whitespace-nowrap text-sm font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0, y: 0 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          Download Profile
        </motion.div>
      )}
    </div>
  );
}
