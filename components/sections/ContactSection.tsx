'use client';

import { useButton } from '@react-aria/button';
import { motion, useInView } from 'framer-motion';
import { Mail, MessageSquare, Phone } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { ContactReveal } from '@/components/ContactReveal';
import type { Profile } from '@/types/content';

interface ContactSectionProps {
  profile: Profile;
  dictionary: Dictionary;
}

export function ContactSection({ profile, dictionary }: ContactSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });
  const [isRevealed, setIsRevealed] = useState(false);

  const revealButtonRef = useRef<HTMLButtonElement>(null);
  const revealButtonProps = useButton(
    {
      onPress: () => {
        setIsRevealed(true);
      },
    },
    revealButtonRef
  ).buttonProps;

  return (
    <section id="contact" ref={ref} className="py-20 px-4 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Get In Touch</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-4" />
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Interested in working together? I'd love to hear from you. Send me a message and I'll
            respond as soon as possible.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
            <button
              {...revealButtonProps}
              ref={revealButtonRef}
              className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {dictionary.contact.reveal}
            </button>
          </motion.div>

          <motion.button
            type="button"
            className="group px-8 py-4 border-2 border-border rounded-xl hover:bg-accent hover:text-accent-foreground hover:border-primary/50 transition-all duration-200 font-semibold flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {dictionary.contact.sendMessage}
          </motion.button>
        </motion.div>

        {isRevealed && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-xl shadow-sm">
                <Mail className="w-5 h-5 text-primary" />
                <ContactReveal email={profile.contact.email} dictionary={dictionary} />
              </div>
              {profile.contact.phone && (
                <div className="flex items-center gap-3 px-6 py-4 bg-card border border-border rounded-xl shadow-sm">
                  <Phone className="w-5 h-5 text-primary" />
                  <div className="text-muted-foreground">
                    <span className="font-semibold">{dictionary.contact.phone}:</span>{' '}
                    <span className="font-mono">{profile.contact.phone}</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
