'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SectionTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  shapeType: 'grid' | 'hexagons' | 'triangles' | 'diamonds' | 'polygons';
}

const sectionThemes: Record<string, SectionTheme> = {
  hero: {
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#06B6D4',
    shapeType: 'grid',
  },
  metrics: {
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    accentColor: '#14B8A6',
    shapeType: 'diamonds',
  },
  experience: {
    primaryColor: '#8B5CF6',
    secondaryColor: '#EC4899',
    accentColor: '#A855F7',
    shapeType: 'triangles',
  },
  projects: {
    primaryColor: '#3B82F6',
    secondaryColor: '#F59E0B',
    accentColor: '#EF4444',
    shapeType: 'hexagons',
  },
  skills: {
    primaryColor: '#10B981',
    secondaryColor: '#3B82F6',
    accentColor: '#8B5CF6',
    shapeType: 'polygons',
  },
  default: {
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    accentColor: '#06B6D4',
    shapeType: 'grid',
  },
};

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState('hero');
  const [currentTheme, setCurrentTheme] = useState(sectionThemes.hero);

  // Only render on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track which section is in view
  useEffect(() => {
    if (!mounted) return;
    const sections = ['hero', 'metrics', 'experience', 'projects', 'skills', 'achievements', 'contact'];

    const observers = sections.map((sectionId) => {
      const element = document.getElementById(sectionId);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCurrentSection(sectionId);
              setCurrentTheme(sectionThemes[sectionId] || sectionThemes.default);
            }
          });
        },
        { threshold: 0.3 }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  // Parallax transforms
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Mouse parallax
  useEffect(() => {
    if (!mounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mounted]);

  // Don't render during SSR
  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated geometric grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: currentTheme.primaryColor, stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: currentTheme.secondaryColor, stopOpacity: 0.15 }} />
          </linearGradient>
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: currentTheme.secondaryColor, stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: currentTheme.accentColor, stopOpacity: 0.15 }} />
          </linearGradient>
          <linearGradient id="grad3" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: currentTheme.accentColor, stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: currentTheme.primaryColor, stopOpacity: 0.15 }} />
          </linearGradient>
        </defs>

        {/* Grid pattern */}
        {currentTheme.shapeType === 'grid' && (
          <g>
            {[...Array(12)].map((_, i) => (
              <g key={i}>
                <rect
                  x={`${(i * 15) % 100}%`}
                  y={`${(i * 8) % 80}%`}
                  width="120"
                  height="120"
                  fill="none"
                  stroke="url(#grad1)"
                  strokeWidth="2"
                  opacity="0.6"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${(i * 15) % 100 + 60} ${(i * 8) % 80 + 60}`}
                    to={`360 ${(i * 15) % 100 + 60} ${(i * 8) % 80 + 60}`}
                    dur={`${20 + i * 2}s`}
                    repeatCount="indefinite"
                  />
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${4 + i}s`} repeatCount="indefinite" />
                </rect>
                <circle
                  cx={`${(i * 15) % 100 + 5}%`}
                  cy={`${(i * 8) % 80 + 5}%`}
                  r="40"
                  fill="none"
                  stroke="url(#grad2)"
                  strokeWidth="2"
                  opacity="0.5"
                >
                  <animate attributeName="r" values="40;60;40" dur={`${8 + i}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${5 + i}s`} repeatCount="indefinite" />
                </circle>
              </g>
            ))}
          </g>
        )}

        {/* Hexagon pattern */}
        {currentTheme.shapeType === 'hexagons' && (
          <g>
            {[...Array(15)].map((_, i) => {
              const x = (i % 5) * 20 + 10;
              const y = Math.floor(i / 5) * 25 + 15;
              const points = `${x},${y} ${x + 5},${y - 3} ${x + 10},${y} ${x + 10},${y + 6} ${x + 5},${y + 9} ${x},${y + 6}`;
              return (
                <polygon
                  key={i}
                  points={points}
                  fill="none"
                  stroke="url(#grad1)"
                  strokeWidth="2"
                  opacity="0.5"
                  transform={`scale(${8 + (i % 3)})`}
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${x + 5} ${y + 3}`}
                    to={`360 ${x + 5} ${y + 3}`}
                    dur={`${15 + i * 2}s`}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${6 + i}s`} repeatCount="indefinite" />
                </polygon>
              );
            })}
          </g>
        )}

        {/* Triangle pattern */}
        {currentTheme.shapeType === 'triangles' && (
          <g>
            {[...Array(20)].map((_, i) => {
              const x = (i * 13) % 100;
              const y = (i * 17) % 100;
              return (
                <polygon
                  key={i}
                  points={`${x},${y} ${x + 10},${y + 15} ${x - 10},${y + 15}`}
                  fill={i % 3 === 0 ? 'url(#grad1)' : i % 3 === 1 ? 'url(#grad2)' : 'url(#grad3)'}
                  opacity="0.4"
                  transform={`scale(${6 + (i % 4)})`}
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${x} ${y + 7.5}`}
                    to={`${i % 2 === 0 ? 360 : -360} ${x} ${y + 7.5}`}
                    dur={`${18 + i * 1.5}s`}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${5 + i * 0.5}s`} repeatCount="indefinite" />
                </polygon>
              );
            })}
          </g>
        )}

        {/* Diamond pattern */}
        {currentTheme.shapeType === 'diamonds' && (
          <g>
            {[...Array(18)].map((_, i) => {
              const x = (i * 11) % 95 + 5;
              const y = (i * 13) % 85 + 10;
              return (
                <g key={i}>
                  <polygon
                    points={`${x},${y - 8} ${x + 8},${y} ${x},${y + 8} ${x - 8},${y}`}
                    fill="none"
                    stroke={i % 2 === 0 ? 'url(#grad1)' : 'url(#grad2)'}
                    strokeWidth="2"
                    opacity="0.5"
                    transform={`scale(${5 + (i % 3)})`}
                  >
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from={`0 ${x} ${y}`}
                      to={`360 ${x} ${y}`}
                      dur={`${16 + i * 2}s`}
                      repeatCount="indefinite"
                      additive="sum"
                    />
                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur={`${4 + i * 0.8}s`} repeatCount="indefinite" />
                  </polygon>
                  <rect
                    x={x - 4}
                    y={y - 4}
                    width="8"
                    height="8"
                    fill="url(#grad3)"
                    opacity="0.3"
                    transform={`scale(${4 + (i % 2)}) rotate(45 ${x} ${y})`}
                  >
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur={`${7 + i}s`} repeatCount="indefinite" />
                  </rect>
                </g>
              );
            })}
          </g>
        )}

        {/* Complex polygon pattern */}
        {currentTheme.shapeType === 'polygons' && (
          <g>
            {[...Array(16)].map((_, i) => {
              const x = (i * 15) % 100;
              const y = (i * 19) % 90;
              const sides = 5 + (i % 3);
              const points = Array.from({ length: sides }, (_, j) => {
                const angle = (j * 2 * Math.PI) / sides - Math.PI / 2;
                return `${x + 10 * Math.cos(angle)},${y + 10 * Math.sin(angle)}`;
              }).join(' ');
              return (
                <polygon
                  key={i}
                  points={points}
                  fill={i % 3 === 0 ? 'url(#grad1)' : i % 3 === 1 ? 'url(#grad2)' : 'url(#grad3)'}
                  opacity="0.4"
                  transform={`scale(${5 + (i % 4)})`}
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${x} ${y}`}
                    to={`${i % 2 === 0 ? 360 : -360} ${x} ${y}`}
                    dur={`${20 + i * 2}s`}
                    repeatCount="indefinite"
                    additive="sum"
                  />
                  <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${6 + i}s`} repeatCount="indefinite" />
                </polygon>
              );
            })}
          </g>
        )}
      </svg>

      {/* Animated geometric lines */}
      <motion.div
        className="absolute inset-0"
        style={{ y: y1 }}
      >
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="0%"
            y1="20%"
            x2="100%"
            y2="20%"
            stroke={currentTheme.primaryColor}
            strokeWidth="1"
            opacity="0.15"
          >
            <animate attributeName="y1" values="20%;25%;20%" dur="10s" repeatCount="indefinite" />
            <animate attributeName="y2" values="20%;15%;20%" dur="10s" repeatCount="indefinite" />
          </line>
          <line
            x1="0%"
            y1="60%"
            x2="100%"
            y2="60%"
            stroke={currentTheme.secondaryColor}
            strokeWidth="1"
            opacity="0.15"
          >
            <animate attributeName="y1" values="60%;65%;60%" dur="12s" repeatCount="indefinite" />
            <animate attributeName="y2" values="60%;55%;60%" dur="12s" repeatCount="indefinite" />
          </line>
        </svg>
      </motion.div>

      {/* Floating geometric shapes with parallax */}
      <motion.div
        className="absolute top-[15%] left-[10%] w-32 h-32 border-2 opacity-10"
        style={{
          borderColor: currentTheme.primaryColor,
          y: y2,
          rotate,
        }}
      />
      <motion.div
        className="absolute top-[40%] right-[15%] w-40 h-40 border-2 opacity-10"
        style={{
          borderColor: currentTheme.secondaryColor,
          y: y1,
          rotate: useTransform(scrollYProgress, [0, 1], [0, -360]),
          borderRadius: '30%',
        }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[20%] w-36 h-36 border-2 opacity-10"
        style={{
          borderColor: currentTheme.accentColor,
          y: y3,
          rotate: useTransform(scrollYProgress, [0, 1], [360, 0]),
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(${currentTheme.primaryColor}15 1px, transparent 1px), linear-gradient(90deg, ${currentTheme.secondaryColor}15 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
        }}
      />
    </div>
  );
}
