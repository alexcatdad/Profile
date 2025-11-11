'use client';

import { useButton } from '@react-aria/button';
import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { CoverLetterTemplate } from '@/types/content';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: CoverLetterTemplate;
  dictionary: Dictionary;
}

const COVER_LETTER_STORAGE_KEY = 'coverLetterData';

export function CoverLetterModal({ isOpen, onClose, template, dictionary }: CoverLetterModalProps) {
  const [editedTemplate, setEditedTemplate] = useState<CoverLetterTemplate>(template);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved data from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(COVER_LETTER_STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as CoverLetterTemplate;
          setEditedTemplate(parsed);
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    // Auto-save every 2 seconds
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        setIsSaving(true);
        localStorage.setItem(COVER_LETTER_STORAGE_KEY, JSON.stringify(editedTemplate));
        setLastSaved(new Date());
        setTimeout(() => setIsSaving(false), 500);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [editedTemplate, isOpen]);

  const handleReset = () => {
    if (confirm('Reset to template? This will discard all changes.')) {
      setEditedTemplate(template);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(COVER_LETTER_STORAGE_KEY);
      }
    }
  };

  const handleDownload = async () => {
    try {
      setIsSaving(true);

      // Dynamically import PDF components (client-side only)
      const { pdf } = await import('@react-pdf/renderer');
      const { CoverLetterPDF } = await import('@/components/pdf/CoverLetterPDF');

      // Generate PDF
      const blob = await pdf(<CoverLetterPDF template={editedTemplate} />).toBlob();

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cover-letter-${editedTemplate.header.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsSaving(false);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
      setIsSaving(false);
    }
  };

  const downloadButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  const downloadButtonProps = useButton(
    {
      onPress: handleDownload,
    },
    downloadButtonRef
  ).buttonProps;

  const resetButtonProps = useButton(
    {
      onPress: handleReset,
    },
    resetButtonRef
  ).buttonProps;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
        <DialogHeader className="mb-4 sm:mb-6">
          <DialogTitle className="text-xl sm:text-2xl">{dictionary.coverLetter.title}</DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-light">
            Customize your cover letter and download as PDF
          </p>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Header Block */}
          <div className="space-y-3 glass-subtle p-4 sm:p-6 rounded-3xl shadow-apple">
            <label className="text-xs font-semibold text-primary uppercase tracking-wider">Header Information</label>
            <input
              type="text"
              value={editedTemplate.header.name}
              onChange={(e) =>
                setEditedTemplate({
                  ...editedTemplate,
                  header: { ...editedTemplate.header, name: e.target.value },
                })
              }
              className="text-xl sm:text-2xl font-bold w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
              placeholder="Your Name"
            />
            <input
              type="text"
              value={editedTemplate.header.title}
              onChange={(e) =>
                setEditedTemplate({
                  ...editedTemplate,
                  header: { ...editedTemplate.header, title: e.target.value },
                })
              }
              className="text-base sm:text-lg w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
              placeholder="Your Title"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <input
                type="email"
                value={editedTemplate.header.email}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    header: { ...editedTemplate.header, email: e.target.value },
                  })
                }
                className="glass-subtle border-0 px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
                placeholder="Email"
              />
              {editedTemplate.header.phone && (
                <input
                  type="tel"
                  value={editedTemplate.header.phone}
                  onChange={(e) =>
                    setEditedTemplate({
                      ...editedTemplate,
                      header: { ...editedTemplate.header, phone: e.target.value },
                    })
                  }
                  className="glass-subtle border-0 px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
                  placeholder="Phone"
                />
              )}
              <input
                type="text"
                value={editedTemplate.header.location}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    header: { ...editedTemplate.header, location: e.target.value },
                  })
                }
                className="glass-subtle border-0 px-4 py-2.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
                placeholder="Location"
              />
            </div>
          </div>

          {/* Date */}
          <div className="glass-subtle p-4 sm:p-6 rounded-3xl shadow-apple space-y-3">
            <label className="text-xs font-semibold text-primary uppercase tracking-wider">Date</label>
            <input
              type="text"
              value={editedTemplate.date}
              onChange={(e) => setEditedTemplate({ ...editedTemplate, date: e.target.value })}
              className="w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
              placeholder="January 1, 2024"
            />
          </div>

          {/* Recipient */}
          <div className="space-y-3 glass-subtle p-4 sm:p-6 rounded-3xl shadow-apple">
            <label className="text-xs font-semibold text-primary uppercase tracking-wider">Recipient</label>
            <input
              type="text"
              value={editedTemplate.recipient.name}
              onChange={(e) =>
                setEditedTemplate({
                  ...editedTemplate,
                  recipient: { ...editedTemplate.recipient, name: e.target.value },
                })
              }
              className="w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
              placeholder="Hiring Manager Name"
            />
            <input
              type="text"
              value={editedTemplate.recipient.company}
              onChange={(e) =>
                setEditedTemplate({
                  ...editedTemplate,
                  recipient: { ...editedTemplate.recipient, company: e.target.value },
                })
              }
              className="w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
              placeholder="Company Name"
            />
            {editedTemplate.recipient.address && (
              <input
                type="text"
                value={editedTemplate.recipient.address}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    recipient: {
                      ...editedTemplate.recipient,
                      address: e.target.value,
                    },
                  })
                }
                className="w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
                placeholder="Street Address"
              />
            )}
            {editedTemplate.recipient.city && (
              <input
                type="text"
                value={editedTemplate.recipient.city}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    recipient: {
                      ...editedTemplate.recipient,
                      city: e.target.value,
                    },
                  })
                }
                className="w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
                placeholder="City, State ZIP"
              />
            )}
          </div>

          {/* Salutation */}
          <div className="glass-subtle p-4 sm:p-6 rounded-3xl shadow-apple space-y-3">
            <label className="text-xs font-semibold text-primary uppercase tracking-wider">Salutation</label>
            <input
              type="text"
              value={editedTemplate.salutation}
              onChange={(e) => setEditedTemplate({ ...editedTemplate, salutation: e.target.value })}
              className="w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
              placeholder="Dear Hiring Manager,"
            />
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-4">
            <div className="glass-subtle p-4 sm:p-6 rounded-3xl shadow-apple space-y-3">
              <label className="text-xs font-semibold text-primary uppercase tracking-wider">Introduction</label>
              <textarea
                value={editedTemplate.paragraphs.introduction}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    paragraphs: {
                      ...editedTemplate.paragraphs,
                      introduction: e.target.value,
                    },
                  })
                }
                className="w-full min-h-[120px] glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple resize-none"
                placeholder="Opening paragraph that introduces yourself and your interest..."
              />
            </div>

            <div className="glass-subtle p-4 sm:p-6 rounded-3xl shadow-apple space-y-3">
              <label className="text-xs font-semibold text-primary uppercase tracking-wider">Qualifications</label>
              <textarea
                value={editedTemplate.paragraphs.qualifications}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    paragraphs: {
                      ...editedTemplate.paragraphs,
                      qualifications: e.target.value,
                    },
                  })
                }
                className="w-full min-h-[120px] glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple resize-none"
                placeholder="Highlight your relevant skills and experience..."
              />
            </div>

            <div className="glass-subtle p-4 sm:p-6 rounded-3xl shadow-apple space-y-3">
              <label className="text-xs font-semibold text-primary uppercase tracking-wider">Alignment</label>
              <textarea
                value={editedTemplate.paragraphs.alignment}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    paragraphs: {
                      ...editedTemplate.paragraphs,
                      alignment: e.target.value,
                    },
                  })
                }
                className="w-full min-h-[120px] glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple resize-none"
                placeholder="Explain why you're a great fit for the role..."
              />
            </div>

            <div className="glass-subtle p-4 sm:p-6 rounded-3xl shadow-apple space-y-3">
              <label className="text-xs font-semibold text-primary uppercase tracking-wider">Closing</label>
              <textarea
                value={editedTemplate.paragraphs.closing}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    paragraphs: {
                      ...editedTemplate.paragraphs,
                      closing: e.target.value,
                    },
                  })
                }
                className="w-full min-h-[120px] glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple resize-none"
                placeholder="Express enthusiasm and next steps..."
              />
            </div>
          </div>

          {/* Signature */}
          <div className="glass-subtle p-4 sm:p-6 rounded-3xl shadow-apple space-y-4">
            <label className="text-xs font-semibold text-primary uppercase tracking-wider">Signature</label>
            <div className="space-y-3">
              <input
                type="text"
                value={editedTemplate.signature.closing}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    signature: {
                      ...editedTemplate.signature,
                      closing: e.target.value,
                    },
                  })
                }
                className="w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
                placeholder="Sincerely,"
              />
              <input
                type="text"
                value={editedTemplate.signature.name}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    signature: {
                      ...editedTemplate.signature,
                      name: e.target.value,
                    },
                  })
                }
                className="w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple font-semibold"
                placeholder="Your Name"
              />
              <input
                type="text"
                value={editedTemplate.signature.title}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    signature: {
                      ...editedTemplate.signature,
                      title: e.target.value,
                    },
                  })
                }
                className="w-full glass-subtle border-0 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all shadow-apple"
                placeholder="Your Title"
              />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 glass-subtle p-4 sm:p-6 rounded-3xl shadow-apple">
            <div className="text-sm text-muted-foreground font-medium">
              {isSaving && <span className="text-primary">💾 {dictionary.coverLetter.saved}...</span>}
              {lastSaved && !isSaving && (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  {dictionary.coverLetter.lastEdited.replace(
                    '{timestamp}',
                    lastSaved.toLocaleTimeString()
                  )}
                </span>
              )}
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                {...resetButtonProps}
                ref={resetButtonRef}
                className="flex-1 sm:flex-none px-6 py-3 glass hover:glass-strong rounded-2xl transition-all duration-300 font-semibold text-sm shadow-apple hover:shadow-apple-lg hover:text-primary"
              >
                {dictionary.coverLetter.reset}
              </button>
              <button
                {...downloadButtonProps}
                ref={downloadButtonRef}
                disabled={isSaving}
                className="flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-2xl hover:from-accent hover:to-primary transition-all duration-300 font-semibold text-sm shadow-apple-lg hover:shadow-apple-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  dictionary.coverLetter.download
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
