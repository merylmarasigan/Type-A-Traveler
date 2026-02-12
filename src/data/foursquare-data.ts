import { serverEnv } from '@/config/env'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const getPlacesFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      near: z.string(),
      query: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetch(
      `https://places-api.foursquare.com/places/search?query=${data.query}&near=${data.near}&sort=popularity&limit=50`,
      {
        headers: {
          'X-Places-Api-Version': '2025-06-17',
          Authorization: `Bearer ${serverEnv.FOURSQUARE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (!res.ok) throw new Error(`Failed to fetch places for ${data.query}`)

    const { results } = await res.json()
    return results
  })
