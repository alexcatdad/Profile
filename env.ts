import { envin } from 'envin';
import { z } from 'zod';

const envSchema = z.object({
  API_ENDPOINT: z.string().url().optional(),
  ANALYTICS_KEY: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envin(envSchema, {
  API_ENDPOINT: process.env.API_ENDPOINT,
  ANALYTICS_KEY: process.env.ANALYTICS_KEY,
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
});
