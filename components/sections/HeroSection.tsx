'use client';

import { motion } from 'framer-motion';
import { ArrowDown, Download, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import type { Profile } from '@/types/content';

interface HeroSectionProps {
  profile: Profile;
  dictionary: Dictionary;
}

export function HeroSection({ profile, dictionary }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);

  const scrollToContent = () => {
    const metricsSection = document.getElementById('metrics');
    metricsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const firstName = profile.name.split(' ')[0];
  const lastName = profile.name.split(' ').slice(1).join(' ');

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background) / 0.95) 50%, hsl(var(--background)) 100%)',
      }}
    >
      {/* Subtle gradient accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center space-y-8 sm:space-y-12">
          {/* Sparkle badge - minimal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2 border border-primary/20 bg-primary/5 rounded-full">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Available for Opportunities</span>
            </div>
          </motion.div>

          {/* Main headline - HUGE and BOLD */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-none">
              <span className="block gradient-text-hero">{firstName}</span>
              <span className="block text-foreground mt-2">{lastName}</span>
            </h1>

            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-muted-foreground max-w-5xl mx-auto leading-tight">
              {profile.title}
            </p>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {profile.tagline}
            </motion.p>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-12"
          >
            {[
              { label: 'Years Experience', value: `${profile.yearsOfExperience}+` },
              { label: 'Projects Delivered', value: '50+' },
              { label: 'Technologies', value: '30+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center group"
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-4xl sm:text-5xl md:text-6xl font-black gradient-text-hero">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground font-semibold mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-24 md:mb-0"
          >
            <motion.button
              className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-primary to-accent text-white rounded-2xl font-bold text-lg sm:text-xl shadow-apple-xl hover:shadow-glow-accent transition-all duration-300 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const contact = document.getElementById('contact');
                contact?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                Let's Work Together
                <Sparkles className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>

            <motion.button
              className="px-8 sm:px-12 py-4 sm:py-5 border-2 border-border hover:border-foreground rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
              Download CV
            </motion.button>
          </motion.div>

          {/* Scroll indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            onClick={scrollToContent}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 hidden md:block"
          >
            <motion.div
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="text-sm font-semibold">Scroll to explore</span>
              <div className="w-12 h-12 rounded-full glass flex items-center justify-center group-hover:glass-strong transition-all">
                <ArrowDown className="w-5 h-5" />
              </div>
            </motion.div>
          </motion.button>
        </div>
      </div>
    </section>
  );
}
