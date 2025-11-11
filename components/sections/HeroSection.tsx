'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, Download, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import type { Profile } from '@/types/content';

interface HeroSectionProps {
  profile: Profile;
  dictionary: Dictionary;
}

export function HeroSection({ profile, dictionary }: HeroSectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  // Mouse parallax effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  // Transform for parallax layers
  const x1 = useTransform(x, [0, 1], [0, 30]);
  const y1 = useTransform(y, [0, 1], [0, 30]);
  const x2 = useTransform(x, [0, 1], [0, 20]);
  const y2 = useTransform(y, [0, 1], [0, 20]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

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
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/2 w-full h-full opacity-30"
          style={{ x: x1, y: y1 }}
        >
          <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/40 to-accent/40 blur-3xl animate-pulse-glow" />
        </motion.div>
        <motion.div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full opacity-20"
          style={{ x: x2, y: y2 }}
        >
          <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-tl from-accent/40 to-primary/40 blur-3xl animate-pulse-glow" />
        </motion.div>

        {/* Floating orbs */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${
                i % 2 === 0 ? 'rgba(var(--primary-rgb), 0.15)' : 'rgba(var(--accent-rgb), 0.15)'
              } 0%, transparent 70%)`,
              left: `${20 + i * 15}%`,
              top: `${10 + i * 12}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="flex flex-col items-center text-center space-y-8 sm:space-y-12">
          {/* Sparkle badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 glass-strong rounded-full shadow-apple-xl group hover:shadow-glow transition-all duration-500">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-bold gradient-text">Available for Opportunities</span>
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
              <span className="block gradient-text-hero text-3d">{firstName}</span>
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
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
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
              className="px-8 sm:px-12 py-4 sm:py-5 glass-strong rounded-2xl font-bold text-lg sm:text-xl shadow-apple hover:shadow-apple-xl transition-all duration-300 hover:scale-105 flex items-center gap-3"
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
