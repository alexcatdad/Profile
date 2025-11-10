'use client';

import { useButton } from '@react-aria/button';
import { motion } from 'framer-motion';
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
      <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}>
        <button
          {...revealButtonProps}
          ref={revealButtonRef}
          className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary/50 transition-all duration-200 hover:shadow-md"
          aria-label="Reveal email"
        >
          <Mail className="w-5 h-5 text-muted-foreground" />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex items-center gap-2 bg-card border border-border px-4 py-2 rounded-lg shadow-lg"
    >
      <span className="text-sm font-mono text-card-foreground">{email}</span>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button
          {...copyButtonProps}
          ref={copyButtonRef}
          className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 flex items-center gap-1.5 ${
            copied
              ? 'bg-green-500/10 text-green-600 dark:text-green-400'
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
      </motion.div>
    </motion.div>
  );
}
