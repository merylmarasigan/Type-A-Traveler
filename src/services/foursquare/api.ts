import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'
import type { FsqPlaceSearchResponse } from '@/services/foursquare/schema'
import { serverEnv } from '@/config/env'

export const getPlacesFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      location: z.string(),
      query: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    // will return either general places in the city, or the closest match to the query (if user submitted)
    const urlWithQuery = data.query ? `&query=${data.query}` : ''

    const res = await fetch(
      `https://places-api.foursquare.com/places/search?near=${data.location}&sort=popularity&limit=50${urlWithQuery}`,
      {
        headers: {
          'X-Places-Api-Version': '2025-06-17',
          Authorization: `Bearer ${serverEnv.FOURSQUARE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    )
    if (!res.ok)
      throw new Error(
        `Failed to fetch places from Foursquare for ${data.query}`,
      )

    const response: FsqPlaceSearchResponse = await res.json()
    return response.results
  })
