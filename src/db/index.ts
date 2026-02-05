import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './schema.ts'
import { serverEnv } from '@/config/env.ts'

export const db = drizzle(serverEnv.DATABASE_URL, { schema })
