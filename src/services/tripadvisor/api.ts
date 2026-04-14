import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import type {
  LocationDetails,
  PhotosResponse,
  SearchResponse,
} from '@/services/tripadvisor/schema'
import { serverEnv } from '@/config/env'
import {
  fetchErrorMiddleware,
  fetchOrThrow,
} from '@/services/tripadvisor/middleware'

const TRIPADVISOR_API_URL =
  'https://api.content.tripadvisor.com/api/v1' as const

export const locationCategories = [
  'hotels',
  'attractions',
  'restaurants',
] as const
export const LocationCategoryEnum = z.enum(locationCategories)
export type LocationCategory = z.infer<typeof LocationCategoryEnum>

export const getLocationsFn = createServerFn({ method: 'GET' })
  .middleware([fetchErrorMiddleware])
  .inputValidator(
    z.object({
      location: z.string(),
      category: LocationCategoryEnum,
      lat: z.string(),
      lng: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetchOrThrow(
      `${TRIPADVISOR_API_URL}/location/nearby_search?key=${serverEnv.TRIPADVISOR_API_KEY}&latLong=${data.lat}%2C${data.lng}&category=${data.category}`,
      data.location,
    )

    const response: SearchResponse = await res.json()
    return response.data
  })

export const getSingleLocationFn = createServerFn({ method: 'GET' })
  .middleware([fetchErrorMiddleware])
  .inputValidator(
    z.object({
      locationId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetchOrThrow(
      `${TRIPADVISOR_API_URL}/location/${data.locationId}/details?key=${serverEnv.TRIPADVISOR_API_KEY}`,
    )

    const response: LocationDetails = await res.json()
    return response
  })

export const getSingleLocationPhotoFn = createServerFn({ method: 'GET' })
  .middleware([fetchErrorMiddleware])
  .inputValidator(
    z.object({
      locationId: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetchOrThrow(
      `${TRIPADVISOR_API_URL}/location/${data.locationId}/photos?key=${serverEnv.TRIPADVISOR_API_KEY}`,
    )

    const response: PhotosResponse = await res.json()
    const images = response.data.map((p) => p.images)

    // if(!images)
    // {
    //   return null
    // }

    if (images.length == 0) {
      return null
    }

    const url =
      images.length > 0 ? images[0].original.url : images[0].medium.url
    return url
  })

export const getDefaultLocationFn = createServerFn({ method: 'GET' })
  .middleware([fetchErrorMiddleware])
  .inputValidator(
    z.object({
      location: z.string(),
      lat: z.string(),
      lng: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const res = await fetchOrThrow(
      `${TRIPADVISOR_API_URL}/location/search?searchQuery=${data.location}&key=${serverEnv.TRIPADVISOR_API_KEY}&latLong=${data.lat}%2C${data.lng}`,
      data.location,
    )

    const response: SearchResponse = await res.json()
    return response.data[0]
  })
