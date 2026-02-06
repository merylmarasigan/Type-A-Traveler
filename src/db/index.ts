import { drizzle } from 'drizzle-orm/node-postgres'

import { serverEnv } from '@/config/env.ts'
import * as auth from './schema/auth'
import * as app from './schema/app'
import * as relations from './schema/relations'

export const db = drizzle(serverEnv.DATABASE_URL, {
  schema: { ...app, ...auth, ...relations },
})
