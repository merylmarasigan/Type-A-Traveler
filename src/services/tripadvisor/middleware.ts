import { notFound } from '@tanstack/react-router'
import { createMiddleware } from '@tanstack/react-start'

export class TripadvisorFetchError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export const fetchOrThrow = async (url: string, location?: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new TripadvisorFetchError(
      res.status,
      `Failed to fetch places for ${location}`,
    )
  }
  return res
}

export const fetchErrorMiddleware = createMiddleware().server(
  async ({ next }) => {
    try {
      return await next()
    } catch (err) {
      if (err instanceof TripadvisorFetchError) {
        switch (err.status) {
          case 403:
            throw new Error(
              'Forbidden: Is your IP address added to your Tripadvisor API key restrictions?',
            )
          case 404:
            throw notFound()
          case 429:
            throw new Error('API call limit reached')
          default:
            throw new Error(err.message)
        }
      }

      throw err
    }
  },
)
