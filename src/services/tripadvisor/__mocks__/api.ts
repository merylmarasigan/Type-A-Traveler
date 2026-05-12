import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'
import {
  LocationCategoryEnum,
  type LocationCategory,
} from '@/services/tripadvisor/categories'
import {
  MOCK_LOCATION_DETAILS,
  getMockPhoto,
  getMockSearchResults,
} from '@/services/tripadvisor/__mocks__/data'

export { LocationCategoryEnum, type LocationCategory }
export { locationCategories } from '@/services/tripadvisor/categories'

export const getLocationsFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      location: z.string(),
      category: LocationCategoryEnum,
      lat: z.string(),
      lng: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    return getMockSearchResults(data.location, data.category)
  })

export const getSingleLocationFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ locationId: z.string() }))
  .handler(async ({ data }) => {
    const location = MOCK_LOCATION_DETAILS[data.locationId]
    if (!location)
      throw new Error(`Mock location not found: ${data.locationId}`)
    return location
  })

export const getSingleLocationPhotoFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ locationId: z.string() }))
  .handler(async ({ data }) => {
    return getMockPhoto(data.locationId)
  })

export const getDefaultLocationFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      location: z.string(),
      lat: z.string(),
      lng: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const results = getMockSearchResults(data.location, 'hotels')
    return results[0]
  })
