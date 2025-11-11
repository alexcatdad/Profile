'use client';

import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';
import type { Metric } from '@/types/content';

interface MetricsSectionProps {
  metrics: Metric[];
}

function AnimatedMetric({ metric }: { metric: Metric }) {
  const numericValue =
    typeof metric.value === 'number'
      ? metric.value
      : parseFloat(metric.value.toString().replace(/[^0-9.]/g, '')) || 0;

  const shouldAnimate = typeof metric.value === 'number' || !isNaN(numericValue);
  const { count, ref } = useCountUp(numericValue, 2000, shouldAnimate);

  const displayValue = shouldAnimate
    ? metric.value.toString().includes('.')
      ? count.toFixed(1)
      : Math.floor(count).toString()
    : metric.value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="glass-strong p-6 sm:p-8 rounded-3xl shadow-apple-lg hover:shadow-apple-xl transition-all duration-300 h-full group hover:-translate-y-1"
        role="article"
        aria-label={`${metric.label}: ${metric.prefix || ''}${metric.value}${metric.suffix || ''}`}
      >
        {metric.icon && (
          <div
            className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300"
            aria-hidden="true"
          >
            {metric.icon}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-baseline gap-1 flex-wrap">
            {metric.prefix && (
              <span className="text-lg sm:text-xl font-semibold text-primary">
                {metric.prefix}
              </span>
            )}
            <span
              ref={ref as any}
              className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              {displayValue}
            </span>
            {metric.suffix && (
              <span className="text-lg sm:text-xl font-semibold text-primary">
                {metric.suffix}
              </span>
            )}
          </div>

          <h3 className="text-base sm:text-lg font-bold text-foreground">{metric.label}</h3>

          {metric.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {metric.description}
            </p>
          )}

          {metric.trend && metric.trend !== 'neutral' && (
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                metric.trend === 'up'
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}
              aria-label={`Trend: ${metric.trend === 'up' ? 'increasing' : 'decreasing'}`}
            >
              <span aria-hidden="true">{metric.trend === 'up' ? '↗' : '↘'}</span>
              <span>{metric.trend === 'up' ? 'Growing' : 'Declining'}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function MetricsSection({ metrics }: MetricsSectionProps) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <section
      id="metrics"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background/50 to-background"
      aria-labelledby="metrics-heading"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            id="metrics-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Impact & Achievements
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Quantifiable results and contributions throughout my career
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {metrics.map((metric) => (
            <AnimatedMetric key={metric.id} metric={metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
