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
  const isInView = useInView(ref, { once: true, margin: '-10%' });

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
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
      }}
      role="article"
      aria-label={`${metric.label}: ${metric.prefix || ''}${metric.value}${metric.suffix || ''}`}
    >
      <div className="space-y-4 p-8 glass-subtle rounded-2xl shadow-apple-lg">
        {/* Icon */}
        {metric.icon && (
          <div className="text-3xl" aria-hidden="true">
            {metric.icon}
          </div>
        )}

        {/* Value */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-1 flex-wrap">
            {metric.prefix && (
              <span className="text-lg font-bold text-primary">{metric.prefix}</span>
            )}
            <span
              ref={countRef as any}
              className="text-5xl sm:text-6xl font-black gradient-text-hero tabular-nums"
            >
              {displayValue}
            </span>
            {metric.suffix && (
              <span className="text-lg font-bold text-primary">{metric.suffix}</span>
            )}
          </div>

          <h3 className="text-base font-bold text-foreground">{metric.label}</h3>

          {metric.description && (
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {metric.description}
            </p>
          )}
        </div>

        {/* Trend indicator */}
        {metric.trend && metric.trend !== 'neutral' && (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-semibold ${
              metric.trend === 'up'
                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                : 'border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400'
            }`}
            aria-label={`Trend: ${metric.trend === 'up' ? 'increasing' : 'decreasing'}`}
          >
            <TrendingUp className={`w-3 h-3 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
            <span>{metric.trend === 'up' ? 'Growing' : 'Declining'}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <section
      id="metrics"
      ref={ref}
      className="py-24 sm:py-32 px-6 sm:px-8 lg:px-12"
      aria-labelledby="metrics-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-20 sm:mb-24"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-6 text-sm font-semibold text-primary"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            <Award className="w-4 h-4" />
            <span>Measurable Impact</span>
          </motion.div>

          <h2
            id="metrics-heading"
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tight"
          >
            <span className="gradient-text-hero">Impact & Results</span>
          </h2>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Quantifiable achievements that drive success
          </motion.p>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {metrics.map((metric, index) => (
            <AnimatedMetric key={metric.id} metric={metric} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
