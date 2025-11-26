'use client';

import { useButton } from '@react-aria/button';
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

  const _downloadCoverLetterButtonProps = useButton(
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
    <nav
      aria-label="Primary profile navigation"
      className={`relative z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass-strong shadow-apple-lg border-b border-border'
          : 'glass-subtle border-b border-border shadow-apple'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="text-2xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-transform duration-200 hover:scale-105"
          >
            Portfolio
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1" role="menubar">
            {visibleLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollToSection(link.id)}
                className={`relative px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                  activeSection === link.id
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                aria-current={activeSection === link.id ? 'true' : undefined}
              >
                {link.label}
                {activeSection === link.id && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 rounded-2xl glass shadow-apple"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {/* <button
              {...downloadCoverLetterButtonProps}
              ref={downloadCoverLetterButtonRef}
              className="px-5 py-2.5 glass hover:glass-strong rounded-2xl transition-transform duration-200 font-semibold text-sm shadow-apple hover:shadow-apple-lg hover:-translate-y-0.5 hover:text-primary text-foreground"
            >
              {dictionary.navigation.downloadCoverLetter}
            </button> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 rounded-2xl glass hover:glass-strong transition-transform duration-200 shadow-apple"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-foreground" />
            ) : (
              <Menu className="h-5 w-5 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden border-t border-border glass-strong transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 overflow-hidden opacity-0'
        }`}
      >
        <div className="px-6 py-6 space-y-2">
          {visibleLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => scrollToSection(link.id)}
              className={`w-full text-left px-5 py-3 rounded-2xl font-semibold transition-colors duration-200 ${
                activeSection === link.id
                  ? 'text-primary glass shadow-apple'
                  : 'text-muted-foreground hover:text-foreground hover:glass-subtle'
              }`}
              aria-current={activeSection === link.id ? 'true' : undefined}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-4 mt-4 border-t border-border space-y-3">
            <div className="flex items-center justify-between px-5 py-3 glass rounded-2xl">
              <span className="text-sm font-semibold text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            {/* <button
              {...downloadCoverLetterButtonProps}
              ref={downloadCoverLetterButtonRef}
              className="w-full px-5 py-3 glass hover:glass-strong rounded-2xl transition-transform duration-200 font-semibold text-left shadow-apple text-foreground"
            >
              {dictionary.navigation.downloadCoverLetter}
            </button> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
