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
    <section id="contact" ref={ref} className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
        >
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="px-6 py-2 glass rounded-full text-sm font-semibold text-primary shadow-apple">
              Let's Connect
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Interested in working together? I'd love to hear from you. Send me a message and I'll
            respond as soon as possible.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3, type: 'spring', stiffness: 100 }}
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.96 }}
          >
            <button
              {...revealButtonProps}
              ref={revealButtonRef}
              className="group px-10 py-5 bg-gradient-to-r from-primary to-accent text-white rounded-3xl hover:from-accent hover:to-primary transition-all duration-300 font-bold text-lg shadow-apple-xl hover:shadow-apple-xl flex items-center justify-center gap-3"
            >
              <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
              {dictionary.contact.reveal}
            </button>
          </motion.div>

          <motion.button
            type="button"
            className="group px-10 py-5 glass hover:glass-strong rounded-3xl transition-all duration-300 font-bold text-lg shadow-apple-lg hover:shadow-apple-xl flex items-center justify-center gap-3 hover:text-primary"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.96 }}
          >
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
            {dictionary.contact.sendMessage}
          </motion.button>
        </motion.div>

        {isRevealed && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
              <motion.div
                className="relative group"
                whileHover={{ y: -4 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-20 blur-xl" />
                <div className="relative flex items-center gap-4 px-8 py-5 glass hover:glass-strong rounded-3xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-300">
                  <Mail className="w-6 h-6 text-primary" />
                  <ContactReveal email={profile.contact.email} dictionary={dictionary} />
                </div>
              </motion.div>
              {profile.contact.phone && (
                <motion.div
                  className="relative group"
                  whileHover={{ y: -4 }}
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-3xl opacity-20 blur-xl" />
                  <div className="relative flex items-center gap-4 px-8 py-5 glass hover:glass-strong rounded-3xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-300">
                    <Phone className="w-6 h-6 text-primary" />
                    <div className="text-foreground">
                      <span className="font-bold">{dictionary.contact.phone}:</span>{' '}
                      <span className="font-mono">{profile.contact.phone}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
