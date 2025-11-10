'use client';

import { useButton } from '@react-aria/button';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
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

  const downloadCVButtonProps = useButton({
    onPress: () => {
      // TODO: Implement CV download
      console.log('Download CV');
    },
  }).buttonProps;

  const downloadCoverLetterButtonProps = useButton({
    onPress: () => {
      const url = new URL(window.location.href);
      url.searchParams.set('coverLetter', 'true');
      window.history.pushState({}, '', url.toString());
      window.dispatchEvent(new PopStateEvent('popstate'));
    },
  }).buttonProps;

  const navLinks = [
    { id: 'skills', label: dictionary.navigation.skills },
    { id: 'experience', label: dictionary.navigation.experience },
    { id: 'projects', label: dictionary.navigation.projects },
    { id: 'education', label: dictionary.navigation.education },
    { id: 'contact', label: dictionary.navigation.contact },
  ];

  return (
    <motion.nav
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border'
          : 'bg-background/80 backdrop-blur-sm'
      }`}
    >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.button
              type="button"
              onClick={() => scrollToSection('skills')}
              className="text-xl font-bold text-foreground hover:text-primary transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Profile
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => scrollToSection(link.id)}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeSection === link.id
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                  }`}
                >
                  {link.label}
                  {activeSection === link.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="activeSection"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <button
                {...downloadCoverLetterButtonProps}
                className="px-4 py-2 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-200 font-medium hover:border-primary/50"
              >
                {dictionary.navigation.downloadCoverLetter}
              </button>
              <button
                {...downloadCVButtonProps}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                {dictionary.navigation.downloadCV}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md"
        >
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === link.id
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-accent/50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
              <button
                {...downloadCoverLetterButtonProps}
                className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium text-left"
              >
                {dictionary.navigation.downloadCoverLetter}
              </button>
              <button
                {...downloadCVButtonProps}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {dictionary.navigation.downloadCV}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.nav>
    </>
  );
}
