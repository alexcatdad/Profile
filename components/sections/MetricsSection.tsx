'use client';

import { motion, useInView } from 'framer-motion';
import { Award, TrendingUp } from 'lucide-react';
import { useRef } from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import type { Metric } from '@/types/content';

interface MetricsSectionProps {
  metrics: Metric[];
}

function AnimatedMetric({ metric, index }: { metric: Metric; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  const numericValue =
    typeof metric.value === 'number'
      ? metric.value
      : parseFloat(metric.value.toString().replace(/[^0-9.]/g, '')) || 0;

  const shouldAnimate = typeof metric.value === 'number' || !isNaN(numericValue);
  const { count, ref: countRef } = useCountUp(numericValue, 2000, shouldAnimate);

  const displayValue = shouldAnimate
    ? metric.value.toString().includes('.')
      ? count.toFixed(1)
      : Math.floor(count).toString()
    : metric.value;

  return (
    <motion.div
      ref={ref}
      className="group relative"
      initial={{ opacity: 0, scale: 0.8, y: 50, rotateX: -20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0, rotateX: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        type: 'spring',
        stiffness: 80,
      }}
      whileHover={{ scale: 1.05, y: -10 }}
    >
      {/* Animated glow ring */}
      <motion.div
        className="absolute -inset-1 rounded-3xl opacity-0 blur-2xl"
        animate={
          isInView
            ? {
                opacity: [0, 0.6, 0],
                scale: [0.95, 1.1, 0.95],
              }
            : {}
        }
        transition={{
          duration: 3,
          delay: index * 0.15 + 1,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: `linear-gradient(135deg, rgba(var(--primary-rgb), 0.6), rgba(var(--accent-rgb), 0.6))`,
        }}
      />

      {/* Particle effect on hover */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [-50, -100],
            }}
            transition={{
              duration: 2,
              delay: index * 0.15 + i * 0.2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
        ))}
      </div>

      <div
        className="relative glass-strong p-8 sm:p-10 rounded-3xl shadow-apple-xl overflow-hidden h-full"
        role="article"
        aria-label={`${metric.label}: ${metric.prefix || ''}${metric.value}${metric.suffix || ''}`}
      >
        {/* Radial gradient background */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(var(--primary-rgb), 0.15), transparent 60%)',
          }}
        />

        <div className="relative z-10 space-y-6">
          {/* Icon with dramatic animation */}
          {metric.icon && (
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass shadow-apple"
              animate={
                isInView
                  ? {
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }
                  : {}
              }
              transition={{
                duration: 2,
                delay: index * 0.15 + 0.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              aria-hidden="true"
            >
              <span className="text-4xl">{metric.icon}</span>
            </motion.div>
          )}

          {/* Value with stagger effect */}
          <div className="space-y-2">
            <motion.div
              className="flex items-baseline gap-2 flex-wrap"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.3 }}
            >
              {metric.prefix && (
                <motion.span
                  className="text-2xl font-black gradient-text"
                  whileHover={{ scale: 1.1 }}
                >
                  {metric.prefix}
                </motion.span>
              )}
              <motion.span
                ref={countRef as any}
                className="text-6xl sm:text-7xl font-black gradient-text-hero text-3d"
                animate={
                  isInView
                    ? {
                        scale: [1, 1.1, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 0.5,
                  delay: index * 0.15 + 1.5,
                }}
              >
                {displayValue}
              </motion.span>
              {metric.suffix && (
                <motion.span
                  className="text-2xl font-black gradient-text"
                  whileHover={{ scale: 1.1 }}
                >
                  {metric.suffix}
                </motion.span>
              )}
            </motion.div>

            <motion.h3
              className="text-xl sm:text-2xl font-black text-foreground"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: index * 0.15 + 0.4 }}
            >
              {metric.label}
            </motion.h3>

            {metric.description && (
              <motion.p
                className="text-base text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: index * 0.15 + 0.5 }}
              >
                {metric.description}
              </motion.p>
            )}
          </div>

          {/* Trend indicator with animation */}
          {metric.trend && metric.trend !== 'neutral' && (
            <motion.div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm shadow-apple ${
                metric.trend === 'up'
                  ? 'bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-green-600 dark:text-green-400'
                  : 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-600 dark:text-red-400'
              }`}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.15 + 0.6, type: 'spring', bounce: 0.6 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              aria-label={`Trend: ${metric.trend === 'up' ? 'increasing' : 'decreasing'}`}
            >
              <TrendingUp
                className={`w-5 h-5 ${metric.trend === 'down' ? 'rotate-180' : ''}`}
              />
              <span>{metric.trend === 'up' ? 'Growing' : 'Declining'}</span>
            </motion.div>
          )}
        </div>

        {/* Corner accent */}
        <motion.div
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          animate={{
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </motion.div>
  );
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-20%' });

  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <section
      id="metrics"
      ref={ref}
      className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      aria-labelledby="metrics-heading"
    >
      {/* Animated mesh background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-accent/20 to-primary/20 blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-8 py-4 glass-strong rounded-full shadow-glow"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, type: 'spring', bounce: 0.5 }}
          >
            <Award className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-base font-black gradient-text">Measurable Impact</span>
          </motion.div>

          <h2
            id="metrics-heading"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none"
          >
            <span className="block gradient-text-hero text-3d">Impact & Results</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto font-light"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Quantifiable achievements that make a difference
          </motion.p>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <AnimatedMetric key={metric.id} metric={metric} index={index} />
          ))}
        </div>

        {/* Bottom call to action */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: metrics.length * 0.15 + 0.5, duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-8 py-4 glass-strong rounded-2xl shadow-apple-xl"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(var(--primary-rgb), 0.4)' }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <TrendingUp className="w-6 h-6 text-primary" />
            <span className="text-lg font-black gradient-text">
              These numbers keep growing every day
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
