'use client';

import { useButton } from '@react-aria/button';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Dictionary } from '@/app/dictionaries/en';
import { ThemeToggle } from './ThemeToggle';

interface NavigationClientProps {
  dictionary: Dictionary;
}

export function NavigationClient({ dictionary }: NavigationClientProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);

      // Determine active section
      const sections = ['skills', 'experience', 'projects', 'education', 'contact'];
      const currentSection = sections.find((id) => {
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
  }, []);

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

  const downloadCVButtonRef = useRef<HTMLButtonElement>(null);
  const downloadCoverLetterButtonRef = useRef<HTMLButtonElement>(null);

  const downloadCVButtonProps = useButton(
    {
      onPress: () => {
        // TODO: Implement CV download
        console.log('Download CV');
      },
    },
    downloadCVButtonRef
  ).buttonProps;

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
  ).buttonProps;

  const navLinks = [
    { id: 'skills', label: dictionary.navigation.skills },
    { id: 'experience', label: dictionary.navigation.experience },
    { id: 'projects', label: dictionary.navigation.projects },
    { id: 'education', label: dictionary.navigation.education },
    { id: 'contact', label: dictionary.navigation.contact },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-strong shadow-apple-lg border-b border-white/10'
          : 'bg-transparent backdrop-blur-0'
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
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <motion.button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className={`relative px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                    activeSection === link.id
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
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
                {...downloadCoverLetterButtonProps}
                ref={downloadCoverLetterButtonRef}
                className="px-5 py-2.5 glass hover:glass-strong rounded-2xl transition-all duration-300 font-semibold text-sm shadow-apple hover:shadow-apple-lg hover:text-primary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                {dictionary.navigation.downloadCoverLetter}
              </motion.button>
              <motion.button
                {...downloadCVButtonProps}
                ref={downloadCVButtonRef}
                className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-2xl hover:from-accent hover:to-primary transition-all duration-300 font-semibold text-sm shadow-apple-lg hover:shadow-apple-xl"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
              >
                {dictionary.navigation.downloadCV}
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
            {navLinks.map((link, index) => (
              <motion.button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className={`w-full text-left px-5 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  activeSection === link.id
                    ? 'text-primary glass shadow-apple'
                    : 'text-muted-foreground hover:text-foreground hover:glass-subtle'
                }`}
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
                {...downloadCoverLetterButtonProps}
                ref={downloadCoverLetterButtonRef}
                className="w-full px-5 py-3 glass hover:glass-strong rounded-2xl transition-all duration-300 font-semibold text-left shadow-apple"
                whileTap={{ scale: 0.98 }}
              >
                {dictionary.navigation.downloadCoverLetter}
              </motion.button>
              <motion.button
                {...downloadCVButtonProps}
                ref={downloadCVButtonRef}
                className="w-full px-5 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-2xl transition-all duration-300 font-semibold shadow-apple-lg"
                whileTap={{ scale: 0.98 }}
              >
                {dictionary.navigation.downloadCV}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.nav>
  );
}
