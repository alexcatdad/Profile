'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { generateCoverLetterTemplate } from '@/lib/cover-letter-helper';
import type { JSONResume } from '@/types/json-resume';
import { CoverLetterModal } from './CoverLetterModal';

interface CoverLetterModalWrapperProps {
  initialOpen: boolean;
  resume: JSONResume;
  dictionary: Dictionary;
}

export function CoverLetterModalWrapper({
  initialOpen,
  resume,
  dictionary,
}: CoverLetterModalWrapperProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Check for cover letter URL parameter
    const coverLetter =
      searchParams.get('coverLetter') || searchParams.get('cover') || searchParams.get('cl');
    if (coverLetter === 'true' || coverLetter === '1' || coverLetter === 'show') {
      setIsOpen(true);
      // Remove parameter from URL
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('coverLetter');
      newSearchParams.delete('cover');
      newSearchParams.delete('cl');
      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl);
    }
  }, [searchParams, router]);

  const template = generateCoverLetterTemplate(resume);

  return (
    <CoverLetterModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      template={template}
      dictionary={dictionary}
    />
  );
}
