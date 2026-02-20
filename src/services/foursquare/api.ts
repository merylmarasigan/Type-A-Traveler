import { serverEnv } from '@/config/env'
import { FsqPlaceSearchResponse } from '@/services/foursquare/schema'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

export const getPlacesFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      location: z.string(),
      query: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetch(
      `https://places-api.foursquare.com/places/search?query=${data.query}&near=${data.location}&sort=popularity&limit=50`,
      {
        headers: {
          'X-Places-Api-Version': '2025-06-17',
          Authorization: `Bearer ${serverEnv.FOURSQUARE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (!res.ok) throw new Error(`Failed to fetch places for ${data.query}`)

    const response: FsqPlaceSearchResponse = await res.json()
    return response.results
  })
