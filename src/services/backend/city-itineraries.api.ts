import {
  createCityItinerary,
  deleteCityItinerary,
  getCityItinerary,
  getFolderCityItineraries,
  updateCityItinerary,
} from '@/db/queries/city-itineraries'
import {
  insertCityItinerarySchema,
  updateCityItinerarySchema,
} from '@/db/types'
import { ensureSession } from '@/services/backend/auth.functions'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'

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

    const deletedCityItinerary = await deleteCityItinerary(data.cityItineraryId)

    return deletedCityItinerary
  })
