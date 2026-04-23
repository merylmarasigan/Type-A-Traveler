import { createServerFn } from '@tanstack/react-start'

/**
 * This still lets users manipulate tables that belong to other users. This only checks that a user is signed in.
 */
export const ensureSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getRequestHeaders } = await import('@tanstack/react-start/server')
    const { auth } = await import('@/lib/auth')
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) {
      throw new Error('Unauthorized')
    }

    return session
  },
)

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { getRequestHeaders } = await import('@tanstack/react-start/server')
    const { auth } = await import('@/lib/auth')
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    return session
  },
)
