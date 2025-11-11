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
      {/* Animated gradient background - Apple style */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background via-50% to-accent/8 gradient-animate" />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      {/* Floating orbs - Apple-inspired */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-[10%] w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"
          animate={{
            x: [0, 80, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-[10%] w-[32rem] h-[32rem] bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] bg-gradient-to-br from-primary/10 via-accent/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: 'spring',
            stiffness: 100,
            damping: 15
          }}
          className="mb-12"
        >
          <div className="relative inline-block group">
            {/* Glowing ring effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

            <motion.img
              src={profile.headshot}
              alt={profile.name}
              className="relative w-52 h-52 rounded-full mx-auto object-cover shadow-apple-xl ring-4 ring-white/50 dark:ring-white/10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            />

            {/* Wave badge with glassmorphism */}
            <motion.div
              className="absolute -bottom-3 -right-3 w-20 h-20 glass-strong rounded-full flex items-center justify-center shadow-apple-lg"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.9,
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <span className="text-3xl">👋</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-extrabold mb-6 bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.4,
            type: 'spring',
            stiffness: 100
          }}
          style={{ lineHeight: 1.05 }}
        >
          {profile.name}
        </motion.h1>

        <motion.p
          className="text-2xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.5,
            type: 'spring',
            stiffness: 100
          }}
        >
          {profile.title}
        </motion.p>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto leading-relaxed font-light"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.7,
            delay: 0.6,
            type: 'spring',
            stiffness: 100
          }}
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          className="flex justify-center gap-3 mb-16 flex-wrap"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.7 }}
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
                className={`w-14 h-14 rounded-2xl glass hover:glass-strong flex items-center justify-center transition-all duration-300 ${link.color} shadow-apple hover:shadow-apple-lg group`}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.8 + index * 0.08,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                }}
                aria-label={link.label}
              >
                <Icon className="w-6 h-6 transition-transform group-hover:scale-110" />
              </motion.a>
            );
          })}
          <ContactReveal email={profile.contact.email} dictionary={dictionary} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.button
            {...scrollToContentButtonProps}
            ref={scrollToContentButtonRef}
            className="w-12 h-12 rounded-full glass hover:glass-strong transition-all duration-300 shadow-apple hover:shadow-apple-lg flex items-center justify-center group mx-auto"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{ y: [0, 8, 0] }}
            transition={{
              y: {
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
            aria-label="Scroll down"
          >
            <ChevronDown className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
