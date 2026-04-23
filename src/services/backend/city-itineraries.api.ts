import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'
import {
  createCityItinerary,
  deleteCityItinerary,
  getCityItinerary,
  getFolderCityItineraries,
  searchCityItineraries,
  updateCityItinerary,
} from '@/db/queries/city-itineraries'
import {
  CityItinerary,
  insertCityItinerarySchema,
  updateCityItinerarySchema,
} from '@/db/types'
import { ensureSession } from '@/services/backend/auth.functions'

export const getFolderCityItinerariesFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ folderId: z.string().optional() }))
  .handler(async ({ data }) => {
    if (!data.folderId) return []

    const folders = await getFolderCityItineraries(data.folderId)

    return folders
  })

export const getSingleCityItineraryFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ cityItineraryId: z.string() }))
  .handler(async ({ data }) => {
    const folder = await getCityItinerary(data.cityItineraryId)

    return folder
  })

export const createCityItineraryFn = createServerFn({ method: 'POST' })
  .inputValidator(insertCityItinerarySchema)
  .handler(async ({ data }) => {
    await ensureSession()

    const newCityItinerary = await createCityItinerary(data)

    return newCityItinerary
  })

export const updateCityItineraryFn = createServerFn({ method: 'POST' })
  .inputValidator(updateCityItinerarySchema)
  .handler(async ({ data }) => {
    await ensureSession()

    const updatedFolder = await updateCityItinerary(data)

    return updatedFolder
  })

export const deleteCityItineraryFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ cityItineraryId: z.string() }))
  .handler(async ({ data }) => {
    await ensureSession()

    const { deletedCityItinerary, remainingCities } = await deleteCityItinerary(
      data.cityItineraryId,
    )

    return { deletedCityItinerary, remainingCities }
  })

export const searchCityItinerariesFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ query: z.string().optional() }))
  .handler(async ({ data }) => {
    if (!data.query) return []

    const result: CityItinerary[] = await searchCityItineraries(data.query)

    return result
  })
