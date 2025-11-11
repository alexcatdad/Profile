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
    primaryColor: 'rgba(59, 130, 246, 0.15)', // primary blue
    secondaryColor: 'rgba(139, 92, 246, 0.15)', // accent purple
    shapeType: 'circles',
    intensity: 1,
  },
  metrics: {
    primaryColor: 'rgba(59, 130, 246, 0.2)',
    secondaryColor: 'rgba(16, 185, 129, 0.15)', // green
    shapeType: 'geometric',
    intensity: 1.2,
  },
  experience: {
    primaryColor: 'rgba(139, 92, 246, 0.15)',
    secondaryColor: 'rgba(236, 72, 153, 0.1)', // pink
    shapeType: 'waves',
    intensity: 0.9,
  },
  projects: {
    primaryColor: 'rgba(59, 130, 246, 0.18)',
    secondaryColor: 'rgba(245, 158, 11, 0.12)', // orange
    shapeType: 'hexagons',
    intensity: 1.1,
  },
  skills: {
    primaryColor: 'rgba(16, 185, 129, 0.15)',
    secondaryColor: 'rgba(59, 130, 246, 0.15)',
    shapeType: 'particles',
    intensity: 1,
  },
  default: {
    primaryColor: 'rgba(59, 130, 246, 0.12)',
    secondaryColor: 'rgba(139, 92, 246, 0.12)',
    shapeType: 'circles',
    intensity: 0.8,
  },
};

export function AnimatedBackground() {
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState('hero');
  const [currentTheme, setCurrentTheme] = useState(sectionThemes.hero);

  // Track which section is in view
  useEffect(() => {
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
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-80%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  // Mouse parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 30,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
            <stop offset="0%" style={{ stopColor: currentTheme.primaryColor, stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: currentTheme.primaryColor, stopOpacity: 0 }} />
          </radialGradient>

          {/* Blur filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="40" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic geometric shapes based on section */}
        {currentTheme.shapeType === 'circles' && (
          <>
            <motion.circle
              cx="20%"
              cy="20%"
              r="150"
              fill="url(#radial1)"
              filter="url(#glow)"
              style={{ y: y1 }}
            >
              <animate attributeName="r" values="150;200;150" dur="6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.6;0.3" dur="6s" repeatCount="indefinite" />
            </motion.circle>

            <motion.circle
              cx="80%"
              cy="40%"
              r="200"
              fill="url(#radial1)"
              filter="url(#glow)"
              style={{ y: y2 }}
            >
              <animate attributeName="r" values="200;250;200" dur="8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="8s" repeatCount="indefinite" />
            </motion.circle>

            <motion.circle
              cx="50%"
              cy="70%"
              r="180"
              fill="url(#radial1)"
              filter="url(#glow)"
              style={{ y: y3 }}
            >
              <animate attributeName="r" values="180;220;180" dur="10s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.25;0.5;0.25" dur="10s" repeatCount="indefinite" />
            </motion.circle>
          </>
        )}

        {currentTheme.shapeType === 'hexagons' && (
          <>
            <motion.path
              d="M 300 200 L 400 250 L 400 350 L 300 400 L 200 350 L 200 250 Z"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.4"
              style={{ y: y1 }}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 300 300"
                to="360 300 300"
                dur="20s"
                repeatCount="indefinite"
              />
            </motion.path>

            <motion.path
              d="M 900 400 L 1000 450 L 1000 550 L 900 600 L 800 550 L 800 450 Z"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.3"
              style={{ y: y2 }}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 900 500"
                to="0 900 500"
                dur="25s"
                repeatCount="indefinite"
              />
            </motion.path>
          </>
        )}

        {currentTheme.shapeType === 'waves' && (
          <>
            <motion.path
              d="M 0 400 Q 400 300 800 400 T 1600 400 L 1600 600 L 0 600 Z"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.15"
            >
              <animate
                attributeName="d"
                values="M 0 400 Q 400 300 800 400 T 1600 400 L 1600 600 L 0 600 Z;
                        M 0 400 Q 400 500 800 400 T 1600 400 L 1600 600 L 0 600 Z;
                        M 0 400 Q 400 300 800 400 T 1600 400 L 1600 600 L 0 600 Z"
                dur="8s"
                repeatCount="indefinite"
              />
            </motion.path>

            <motion.path
              d="M 0 300 Q 400 200 800 300 T 1600 300 L 1600 500 L 0 500 Z"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.1"
            >
              <animate
                attributeName="d"
                values="M 0 300 Q 400 200 800 300 T 1600 300 L 1600 500 L 0 500 Z;
                        M 0 300 Q 400 400 800 300 T 1600 300 L 1600 500 L 0 500 Z;
                        M 0 300 Q 400 200 800 300 T 1600 300 L 1600 500 L 0 500 Z"
                dur="12s"
                repeatCount="indefinite"
              />
            </motion.path>
          </>
        )}

        {currentTheme.shapeType === 'geometric' && (
          <>
            <motion.polygon
              points="200,100 300,200 200,300 100,200"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.3"
              style={{ y: y1 }}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 200 200"
                to="360 200 200"
                dur="15s"
                repeatCount="indefinite"
              />
            </motion.polygon>

            <motion.rect
              x="700"
              y="400"
              width="200"
              height="200"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.25"
              rx="20"
              style={{ y: y2 }}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 800 500"
                to="-360 800 500"
                dur="20s"
                repeatCount="indefinite"
              />
            </motion.rect>

            <motion.polygon
              points="1200,600 1300,650 1250,750 1150,750 1100,650"
              fill="url(#grad1)"
              filter="url(#glow)"
              opacity="0.2"
              style={{ y: y3 }}
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="360 1200 700"
                to="0 1200 700"
                dur="18s"
                repeatCount="indefinite"
              />
            </motion.polygon>
          </>
        )}

        {currentTheme.shapeType === 'particles' && (
          <>
            {[...Array(20)].map((_, i) => (
              <circle
                key={i}
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r={Math.random() * 3 + 1}
                fill={i % 2 === 0 ? currentTheme.primaryColor : currentTheme.secondaryColor}
                opacity="0.6"
              >
                <animate
                  attributeName="cy"
                  values={`${Math.random() * 100}%;${Math.random() * 100}%;${Math.random() * 100}%`}
                  dur={`${10 + Math.random() * 10}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.3;0.8;0.3"
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
        className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${currentTheme.primaryColor} 0%, transparent 70%)`,
          y: y1,
          x: mousePosition.x,
        }}
        animate={{
          scale: [1, 1.2 * currentTheme.intensity, 1],
          opacity: [0.15 * currentTheme.intensity, 0.3 * currentTheme.intensity, 0.15 * currentTheme.intensity],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute top-1/3 -right-1/4 w-[700px] h-[700px] rounded-full opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${currentTheme.secondaryColor} 0%, transparent 70%)`,
          y: y2,
          x: -mousePosition.x * 0.5,
        }}
        animate={{
          scale: [1, 1.3 * currentTheme.intensity, 1],
          opacity: [0.15 * currentTheme.intensity, 0.35 * currentTheme.intensity, 0.15 * currentTheme.intensity],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
        style={{
          background: `radial-gradient(circle, ${currentTheme.primaryColor} 0%, transparent 70%)`,
          y: y3,
          x: mousePosition.x * 0.7,
        }}
        animate={{
          scale: [1, 1.15 * currentTheme.intensity, 1],
          opacity: [0.1 * currentTheme.intensity, 0.25 * currentTheme.intensity, 0.1 * currentTheme.intensity],
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
        className="absolute top-1/2 left-1/2 w-[1000px] h-[1000px] -translate-x-1/2 -translate-y-1/2 opacity-10"
        style={{
          background: `conic-gradient(from 0deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor}, ${currentTheme.primaryColor})`,
          rotate,
        }}
      />

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial gradient vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/60" />
    </div>
  );
}
