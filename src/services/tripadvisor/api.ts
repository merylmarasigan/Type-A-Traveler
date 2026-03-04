import { serverEnv } from '@/config/env'
import {
  LocationDetails,
  PhotosResponse,
  SearchResponse,
} from '@/services/tripadvisor/schema'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'

const TRIPADVISOR_API_URL =
  'https://api.content.tripadvisor.com/api/v1' as const

export const getLocationsFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      location: z.string(),
      category: z.string()
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetch(
      `${TRIPADVISOR_API_URL}/location/search?key=${serverEnv.TRIPADVISOR_API_KEY}&searchQuery=${data.location}&category=${data.category}`,
    )
    if (res.status === 429) throw new Error('API call limit reached')
    if (!res.ok)
      throw new Error(
        `Failed to fetch places from TripAdvisor for ${data.location}`,
      )

    const response: SearchResponse = await res.json()
    return response.data
  })

export const getSingleLocationFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      locationId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetch(
      `${TRIPADVISOR_API_URL}/location/${data.locationId}/details?key=${serverEnv.TRIPADVISOR_API_KEY}`,
    )
    if (res.status === 404) return null
    if (res.status === 429) throw new Error('API call limit reached')
    if (!res.ok)
      throw new Error(
        `Failed to fetch location data from TripAdvisor for ID #${data.locationId}`,
      )

    const response: LocationDetails = await res.json()
    return response
  })

export const getSingleLocationPhotoFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      locationId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetch(
      `${TRIPADVISOR_API_URL}/location/${data.locationId}/photos?key=${serverEnv.TRIPADVISOR_API_KEY}`,
    )
    if (res.status === 429) throw new Error('API call limit reached')
    if (!res.ok)
      throw new Error(
        `Failed to fetch location photos from TripAdvisor for ID #${data.locationId} ${res.status}`,
      )

    const response: PhotosResponse = await res.json()
    const images = response.data.map((p) => p.images)

    const url = images[0].original
      ? images[0].original.url
      : images[0].medium.url
    return url
  })
