'use client';

import { useButton } from '@react-aria/button';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { ThemeToggle } from './ThemeToggle';

interface NavigationClientProps {
  dictionary: Dictionary;
}

export function NavigationClient({ dictionary }: NavigationClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { navigation } = dictionary;
  const navLinks = useMemo(
    () => [
      { id: 'summary', label: navigation.overview ?? 'Overview' },
      { id: 'metrics', label: navigation.metrics ?? 'Metrics' },
      { id: 'skills', label: navigation.skills },
      { id: 'experience', label: navigation.experience },
      { id: 'projects', label: navigation.projects },
      { id: 'publications', label: navigation.publications ?? 'Publications' },
      {
        id: 'personal',
        label: navigation.personal ?? navigation.education ?? navigation.contact,
      },
    ],
    [navigation]
  );
  const [visibleLinks, setVisibleLinks] = useState(navLinks);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const filtered = navLinks.filter((link) => document.getElementById(link.id));
    setVisibleLinks(filtered.length > 0 ? filtered : navLinks);
  }, [navLinks]);

  const sectionIds = useMemo(() => visibleLinks.map((link) => link.id), [visibleLinks]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      // Determine active section
      const currentSection = sectionIds.find((id) => {
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      setActiveSection(currentSection || '');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setIsMobileMenuOpen(false);
    }
  };

  const downloadCoverLetterButtonRef = useRef<HTMLButtonElement>(null);

  const downloadCoverLetterButtonProps = useButton(
    {
      onPress: () => {
        const url = new URL(window.location.href);
        url.searchParams.set('coverLetter', 'true');
        window.history.pushState({}, '', url.toString());
        window.dispatchEvent(new PopStateEvent('popstate'));
      },
    },
    downloadCoverLetterButtonRef
  ).buttonProps as ComponentPropsWithoutRef<'button'>;

  return (
    <motion.nav
      aria-label="Primary profile navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className={`relative z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-strong shadow-apple-lg border-b border-white/10'
          : 'glass-subtle border-b border-white/5 shadow-apple'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:from-accent hover:to-primary transition-all duration-500"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
          >
            Portfolio
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" role="menubar">
            {visibleLinks.map((link) => (
              <motion.button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className={`relative px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                  activeSection === link.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={activeSection === link.id ? 'true' : undefined}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    className="absolute inset-0 glass rounded-2xl -z-10 shadow-apple"
                    layoutId="activeSection"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <motion.button
              {...(() => {
                // biome-ignore lint/suspicious/noExplicitAny: onDrag is causing type conflict
                const { onDrag, onDragEnd, ...rest } = downloadCoverLetterButtonProps as any;
                return rest;
              })()}
              ref={downloadCoverLetterButtonRef}
              className="px-5 py-2.5 glass hover:glass-strong rounded-2xl transition-all duration-300 font-semibold text-sm shadow-apple hover:shadow-apple-lg hover:text-primary"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              {dictionary.navigation.downloadCoverLetter}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-2xl glass hover:glass-strong transition-all duration-300 shadow-apple"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="lg:hidden overflow-hidden border-t border-white/10 glass-strong"
      >
        <div className="px-6 py-6 space-y-2">
          {visibleLinks.map((link, index) => (
            <motion.button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className={`w-full text-left px-5 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeSection === link.id
                  ? 'text-primary glass shadow-apple'
                  : 'text-muted-foreground hover:text-foreground hover:glass-subtle'
              }`}
              aria-current={activeSection === link.id ? 'true' : undefined}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : -20 }}
              transition={{ delay: index * 0.05 }}
            >
              {link.label}
            </motion.button>
          ))}
          <div className="pt-4 mt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between px-5 py-3 glass rounded-2xl">
              <span className="text-sm font-semibold text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            <motion.button
              {...(() => {
                // biome-ignore lint/suspicious/noExplicitAny: onDrag is causing type conflict
                const { onDrag, onDragEnd, ...rest } = downloadCoverLetterButtonProps as any;
                return rest;
              })()}
              ref={downloadCoverLetterButtonRef}
              className="w-full px-5 py-3 glass hover:glass-strong rounded-2xl transition-all duration-300 font-semibold text-left shadow-apple"
              whileTap={{ scale: 0.98 }}
            >
              {dictionary.navigation.downloadCoverLetter}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
