import { db } from '@/db'
import { betterAuth } from 'better-auth'
import { username } from 'better-auth/plugins'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 20,
    }),
    tanstackStartCookies(),
  ],
})
