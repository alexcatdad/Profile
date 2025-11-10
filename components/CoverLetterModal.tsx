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

  const handleDownload = () => {
    // TODO: Implement PDF generation
    console.log('Download PDF', editedTemplate);
    alert('PDF download will be implemented');
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dictionary.coverLetter.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Block */}
          <div className="space-y-2">
            <input
              type="text"
              value={editedTemplate.header.name}
              onChange={(e) =>
                setEditedTemplate({
                  ...editedTemplate,
                  header: { ...editedTemplate.header, name: e.target.value },
                })
              }
              className="text-2xl font-bold w-full bg-transparent border-b border-input focus:outline-none focus:border-primary text-foreground"
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
              className="text-lg w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
            />
            <div className="flex gap-4 text-sm text-muted-foreground">
              <input
                type="email"
                value={editedTemplate.header.email}
                onChange={(e) =>
                  setEditedTemplate({
                    ...editedTemplate,
                    header: { ...editedTemplate.header, email: e.target.value },
                  })
                }
                className="flex-1 bg-transparent border-b border-input focus:outline-none focus:border-primary"
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
                  className="flex-1 bg-transparent border-b border-input focus:outline-none focus:border-primary"
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
                className="flex-1 bg-transparent border-b border-input focus:outline-none focus:border-primary"
                placeholder="Location"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <input
              type="text"
              value={editedTemplate.date}
              onChange={(e) => setEditedTemplate({ ...editedTemplate, date: e.target.value })}
              className="w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
            />
          </div>

          {/* Recipient */}
          <div className="space-y-2">
            <input
              type="text"
              value={editedTemplate.recipient.name}
              onChange={(e) =>
                setEditedTemplate({
                  ...editedTemplate,
                  recipient: { ...editedTemplate.recipient, name: e.target.value },
                })
              }
              className="w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
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
              className="w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
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
                className="w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
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
                className="w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
              />
            )}
          </div>

          {/* Salutation */}
          <div>
            <input
              type="text"
              value={editedTemplate.salutation}
              onChange={(e) => setEditedTemplate({ ...editedTemplate, salutation: e.target.value })}
              className="w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
            />
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-4">
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
              className="w-full min-h-[100px] p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              placeholder="Introduction paragraph"
            />
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
              className="w-full min-h-[100px] p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              placeholder="Qualifications paragraph"
            />
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
              className="w-full min-h-[100px] p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              placeholder="Alignment paragraph"
            />
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
              className="w-full min-h-[100px] p-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background"
              placeholder="Closing paragraph"
            />
          </div>

          {/* Signature */}
          <div className="space-y-2">
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
              className="w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
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
              className="w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
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
              className="w-full bg-transparent border-b border-input focus:outline-none focus:border-primary"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {isSaving && <span>{dictionary.coverLetter.saved}...</span>}
              {lastSaved && !isSaving && (
                <span>
                  {dictionary.coverLetter.lastEdited.replace(
                    '{timestamp}',
                    lastSaved.toLocaleTimeString()
                  )}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <Button {...resetButtonProps} variant="outline" onClick={handleReset}>
                {dictionary.coverLetter.reset}
              </Button>
              <Button {...downloadButtonProps} onClick={handleDownload}>
                {dictionary.coverLetter.download}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
