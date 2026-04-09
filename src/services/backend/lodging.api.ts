import {
  createLodging,
  deleteLodging,
  getLodging,
  getItineraryLodging,
  updateLodging,
} from '@/db/queries/lodging'
import { insertLodgingSchema, updateLodgingSchema } from '@/db/types'
import { ensureSession } from '@/services/backend/auth.functions'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'

export const getItineraryLodgingFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ itineraryFolderId: z.string() }))
  .handler(async ({ data }) => {
    const lodging = await getItineraryLodging(data.itineraryFolderId)

    return lodging
  })

export const getSingleLodgingFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ lodgingId: z.string() }))
  .handler(async ({ data }) => {
    const lodging = await getLodging(data.lodgingId)

    return lodging
  })

export const createLodgingFn = createServerFn({ method: 'POST' })
  .inputValidator(insertLodgingSchema)
  .handler(async ({ data }) => {
    await ensureSession()

    const newLodging = await createLodging(data)

    return newLodging
  })

export const updateLodgingFn = createServerFn({ method: 'POST' })
  .inputValidator(updateLodgingSchema)
  .handler(async ({ data }) => {
    await ensureSession()

    const updatedLodging = await updateLodging(data)

    return updatedLodging
  })

export const deleteLodgingFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ lodgingId: z.string() }))
  .handler(async ({ data }) => {
    await ensureSession()

    const deletedLodging = await deleteLodging(data.lodgingId)

    return deletedLodging
  })
