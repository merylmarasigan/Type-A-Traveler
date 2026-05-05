import { config } from 'dotenv'
import { z } from 'zod/v4'

config({ path: ['.env.local', '.env'] })

const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional(),

  GEONAMES_USERNAME: z.string(),
  FOURSQUARE_API_KEY: z.string(),
  TRIPADVISOR_API_KEY: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  VITE_USE_MOCK_API: z.stringbool().default(true),
})

// Validate server environment
export const serverEnv = envSchema.parse(process.env)
