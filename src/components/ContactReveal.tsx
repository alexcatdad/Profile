'use client';

import { useButton } from '@react-aria/button';
import { Check, Copy, Mail } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';

interface ContactRevealProps {
  email: string;
  dictionary: Dictionary;
}

export function ContactReveal({ email, dictionary }: ContactRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const revealButtonRef = useRef<HTMLButtonElement>(null);
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  const revealButtonProps = useButton(
    {
      onPress: () => {
        setIsRevealed(true);
      },
    },
    revealButtonRef
  ).buttonProps;

  const copyButtonProps = useButton(
    {
      onPress: async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      },
    },
    copyButtonRef
  ).buttonProps;

  if (!isRevealed) {
    return (
      <button
        {...revealButtonProps}
        ref={revealButtonRef}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 hover:border-primary hover:bg-accent hover:shadow-md"
        aria-label="Reveal email"
      >
        <Mail className="w-5 h-5 text-muted-foreground" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm shadow-lg transition-transform duration-200 hover:-translate-y-0.5">
      <span className="font-mono text-foreground">{email}</span>
      <button
        {...copyButtonProps}
        ref={copyButtonRef}
        className={`px-3 py-1.5 text-xs rounded-md transition-colors duration-200 flex items-center gap-1.5 ${
          copied
            ? 'bg-primary/10 text-primary dark:text-primary'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3 h-3" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3 h-3" />
            <span>{dictionary.contact.copy}</span>
          </>
        )}
      </button>
    </div>
  );
}
