'use client';

import { useButton } from '@react-aria/button';
import { motion } from 'framer-motion';
import { Check, Copy, Mail } from 'lucide-react';
import { useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';

interface ContactRevealProps {
  email: string;
  dictionary: Dictionary;
}

export function ContactReveal({ email, dictionary }: ContactRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const revealButtonProps = useButton({
    onPress: () => {
      setIsRevealed(true);
    },
  }).buttonProps;

  const copyButtonProps = useButton({
    onPress: async () => {
      try {
        await navigator.clipboard.writeText(email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    },
  }).buttonProps;

  if (!isRevealed) {
    return (
      <motion.button
        {...revealButtonProps}
        className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary/50 transition-all duration-200 hover:shadow-md"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Reveal email"
      >
        <Mail className="w-5 h-5 text-muted-foreground" />
      </motion.button>
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
      <motion.button
        {...copyButtonProps}
        className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 flex items-center gap-1.5 ${
          copied
            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
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
      </motion.button>
    </motion.div>
  );
}
