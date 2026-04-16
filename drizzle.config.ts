import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'
import { serverEnv } from '@/config/env'

config({ path: ['.env.local', '.env'] })

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
})
