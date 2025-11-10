'use client';

import { useButton } from '@react-aria/button';
import { motion } from 'framer-motion';
import { ChevronDown, Github, Linkedin, Twitter } from 'lucide-react';
import { useRef } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { ContactReveal } from '@/components/ContactReveal';
import type { Profile } from '@/types/content';

interface HeroSectionProps {
  profile: Profile;
  dictionary: Dictionary;
}

export function HeroSection({ profile, dictionary }: HeroSectionProps) {
  const scrollToContentButtonRef = useRef<HTMLButtonElement>(null);
  const scrollToContentButtonProps = useButton(
    {
      onPress: () => {
        const element = document.getElementById('summary');
        element?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    scrollToContentButtonRef
  ).buttonProps;

  const socialLinks = [
    profile.social.github && {
      href: `https://github.com/${profile.social.github}`,
      icon: Github,
      label: 'GitHub',
      color: 'hover:text-[#181717] dark:hover:text-[#f5f5f5]',
    },
    profile.social.linkedin && {
      href: `https://linkedin.com/in/${profile.social.linkedin}`,
      icon: Linkedin,
      label: 'LinkedIn',
      color: 'hover:text-[#0077B5]',
    },
    profile.social.twitter && {
      href: `https://twitter.com/${profile.social.twitter}`,
      icon: Twitter,
      label: 'Twitter',
      color: 'hover:text-[#1DA1F2]',
    },
  ].filter(Boolean);

  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.img
              src={profile.headshot}
              alt={profile.name}
              className="w-48 h-48 rounded-full mx-auto object-cover shadow-2xl ring-4 ring-primary/20"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <motion.div
              className="absolute -bottom-2 -right-2 w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
            >
              <span className="text-2xl">👋</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 text-foreground bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {profile.name}
        </motion.h1>

        <motion.p
          className="text-2xl md:text-3xl text-primary font-semibold mb-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {profile.title}
        </motion.p>

        <motion.p
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="flex justify-center gap-4 mb-12 flex-wrap"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {socialLinks.map((link, index) => {
            if (!link) return null;
            const Icon = link.icon;
            return (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center transition-all duration-200 ${link.color} hover:border-primary/50 hover:shadow-md`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                aria-label={link.label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            );
          })}
          <ContactReveal email={profile.contact.email} dictionary={dictionary} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1 },
            y: {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          <button
            {...scrollToContentButtonProps}
            ref={scrollToContentButtonRef}
            className="text-muted-foreground hover:text-primary transition-colors group"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-8 h-8 mx-auto group-hover:scale-110 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
