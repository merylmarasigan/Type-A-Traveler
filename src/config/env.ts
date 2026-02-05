import { config } from 'dotenv'
import { z } from 'zod/v4'

config({ path: ['.env.local', '.env'] })

const envSchema = z.object({
  DATABASE_URL: z.url(),
  BETTER_AUTH_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),
})

// Validate server environment
export const serverEnv = envSchema.parse(process.env)
