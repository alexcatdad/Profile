'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface SectionTheme {
  primaryColor: string;
  secondaryColor: string;
  shapeType: 'circles' | 'hexagons' | 'waves' | 'particles' | 'geometric';
  intensity: number;
}

const sectionThemes: Record<string, SectionTheme> = {
  hero: {
    primaryColor: 'rgba(59, 130, 246, 0.4)', // primary blue
    secondaryColor: 'rgba(139, 92, 246, 0.4)', // accent purple
    shapeType: 'circles',
    intensity: 1,
  },
  metrics: {
    primaryColor: 'rgba(59, 130, 246, 0.45)',
    secondaryColor: 'rgba(16, 185, 129, 0.4)', // green
    shapeType: 'geometric',
    intensity: 1.2,
  },
  experience: {
    primaryColor: 'rgba(139, 92, 246, 0.4)',
    secondaryColor: 'rgba(236, 72, 153, 0.35)', // pink
    shapeType: 'waves',
    intensity: 0.9,
  },
  projects: {
    primaryColor: 'rgba(59, 130, 246, 0.45)',
    secondaryColor: 'rgba(245, 158, 11, 0.35)', // orange
    shapeType: 'hexagons',
    intensity: 1.1,
  },
  skills: {
    primaryColor: 'rgba(16, 185, 129, 0.4)',
    secondaryColor: 'rgba(59, 130, 246, 0.4)',
    shapeType: 'particles',
    intensity: 1,
  },
  default: {
    primaryColor: 'rgba(59, 130, 246, 0.3)',
    secondaryColor: 'rgba(139, 92, 246, 0.3)',
    shapeType: 'circles',
    intensity: 0.8,
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
      {/* SVG Animated Shapes Layer */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: currentTheme.primaryColor, stopOpacity: 1 }}>
              <animate attributeName="stop-color" values={`${currentTheme.primaryColor};${currentTheme.secondaryColor};${currentTheme.primaryColor}`} dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" style={{ stopColor: currentTheme.secondaryColor, stopOpacity: 1 }}>
              <animate attributeName="stop-color" values={`${currentTheme.secondaryColor};${currentTheme.primaryColor};${currentTheme.secondaryColor}`} dur="8s" repeatCount="indefinite" />
            </stop>
          </linearGradient>

          <radialGradient id="radial1">
            <stop offset="0%" style={{ stopColor: currentTheme.primaryColor, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: currentTheme.primaryColor, stopOpacity: 0 }} />
          </radialGradient>

          <radialGradient id="radial2">
            <stop offset="0%" style={{ stopColor: currentTheme.secondaryColor, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: currentTheme.secondaryColor, stopOpacity: 0 }} />
          </radialGradient>

          {/* Blur filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="50" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic geometric shapes based on section */}
        {currentTheme.shapeType === 'circles' && (
          <>
            <circle
              cx="20%"
              cy="20%"
              r="150"
              fill="url(#radial1)"
              filter="url(#glow)"
              opacity="0.8"
            >
              <animate attributeName="r" values="150;250;150" dur="8s" repeatCount="indefinite" />
              <animate attributeName="cy" values="20%;25%;20%" dur="10s" repeatCount="indefinite" />
            </circle>

            <circle
              cx="80%"
              cy="40%"
              r="200"
              fill="url(#radial2)"
              filter="url(#glow)"
              opacity="0.7"
            >
              <animate attributeName="r" values="200;300;200" dur="10s" repeatCount="indefinite" />
              <animate attributeName="cx" values="80%;75%;80%" dur="12s" repeatCount="indefinite" />
            </circle>

            <circle
              cx="50%"
              cy="70%"
              r="180"
              fill="url(#radial1)"
              filter="url(#glow)"
              opacity="0.6"
            >
              <animate attributeName="r" values="180;280;180" dur="12s" repeatCount="indefinite" />
              <animate attributeName="cy" values="70%;65%;70%" dur="14s" repeatCount="indefinite" />
            </circle>
          </>
        )}

        {currentTheme.shapeType === 'hexagons' && (
          <>
            <path
              d="M 300 200 L 400 250 L 400 350 L 300 400 L 200 350 L 200 250 Z"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.7"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 300 300"
                to="360 300 300"
                dur="20s"
                repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0.5;0.9;0.5" dur="6s" repeatCount="indefinite" />
            </path>

            <path
              d="M 900 400 L 1000 450 L 1000 550 L 900 600 L 800 550 L 800 450 Z"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 900 500"
                to="0 900 500"
                dur="25s"
                repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="8s" repeatCount="indefinite" />
            </path>
          </>
        )}

        {currentTheme.shapeType === 'waves' && (
          <>
            <path
              d="M 0 400 Q 400 300 800 400 T 1600 400 L 1600 800 L 0 800 Z"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.5"
            >
              <animate
                attributeName="d"
                values="M 0 400 Q 400 300 800 400 T 1600 400 L 1600 800 L 0 800 Z;
                        M 0 400 Q 400 500 800 400 T 1600 400 L 1600 800 L 0 800 Z;
                        M 0 400 Q 400 300 800 400 T 1600 400 L 1600 800 L 0 800 Z"
                dur="8s"
                repeatCount="indefinite"
              />
            </path>

            <path
              d="M 0 300 Q 400 200 800 300 T 1600 300 L 1600 700 L 0 700 Z"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.4"
            >
              <animate
                attributeName="d"
                values="M 0 300 Q 400 200 800 300 T 1600 300 L 1600 700 L 0 700 Z;
                        M 0 300 Q 400 400 800 300 T 1600 300 L 1600 700 L 0 700 Z;
                        M 0 300 Q 400 200 800 300 T 1600 300 L 1600 700 L 0 700 Z"
                dur="12s"
                repeatCount="indefinite"
              />
            </path>
          </>
        )}

        {currentTheme.shapeType === 'geometric' && (
          <>
            <polygon
              points="200,100 300,200 200,300 100,200"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 200 200"
                to="360 200 200"
                dur="15s"
                repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="5s" repeatCount="indefinite" />
            </polygon>

            <rect
              x="700"
              y="400"
              width="200"
              height="200"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.5"
              rx="20"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 800 500"
                to="-360 800 500"
                dur="20s"
                repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="7s" repeatCount="indefinite" />
            </rect>

            <polygon
              points="1200,600 1300,650 1250,750 1150,750 1100,650"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.5"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 1200 700"
                to="0 1200 700"
                dur="18s"
                repeatCount="indefinite"
              />
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="6s" repeatCount="indefinite" />
            </polygon>
          </>
        )}

        {currentTheme.shapeType === 'particles' && (
          <>
            {[...Array(30)].map((_, i) => (
              <circle
                key={i}
                cx={`${(i * 7) % 100}%`}
                cy={`${(i * 11) % 100}%`}
                r={Math.random() * 4 + 2}
                fill={i % 2 === 0 ? currentTheme.primaryColor : currentTheme.secondaryColor}
                opacity="0.7"
              >
                <animate
                  attributeName="cy"
                  values={`${(i * 11) % 100}%;${((i * 11) + 20) % 100}%;${(i * 11) % 100}%`}
                  dur={`${10 + Math.random() * 10}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.4;1;0.4"
                  dur={`${3 + Math.random() * 3}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </>
        )}
      </svg>

      {/* Framer Motion animated gradients with mouse parallax */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-[1000px] h-[1000px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${currentTheme.primaryColor} 0%, transparent 70%)`,
          y: y1,
          x: mousePosition.x,
          opacity: 0.6 * currentTheme.intensity,
        }}
        animate={{
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/3 -right-1/4 w-[900px] h-[900px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${currentTheme.secondaryColor} 0%, transparent 70%)`,
          y: y2,
          x: -mousePosition.x * 0.5,
          opacity: 0.5 * currentTheme.intensity,
        }}
        animate={{
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/3 w-[800px] h-[800px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${currentTheme.primaryColor} 0%, transparent 70%)`,
          y: y3,
          x: mousePosition.x * 0.7,
          opacity: 0.4 * currentTheme.intensity,
        }}
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Rotating gradient mesh */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[1200px] h-[1200px] -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{
          background: `conic-gradient(from 0deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor}, ${currentTheme.primaryColor})`,
          rotate,
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/40" />
    </div>
  );
}
