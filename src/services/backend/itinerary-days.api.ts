import {
  createItineraryDays,
  deleteItineraryDay,
  getItineraryDay,
  getCityItineraryDays,
  updateMultipleItineraryDays,
  updateSingleItineraryDay,
} from '@/db/queries/itinerary-days'
import { insertItineraryDaySchema, updateItineraryDaySchema } from '@/db/types'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'

export const getCityItineraryDaysFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ cityItineraryId: z.string().optional() }))
  .handler(async ({ data }) => {
    if (!data.cityItineraryId) return []

    const days = await getCityItineraryDays(data.cityItineraryId)

    return days
  })

export const getSingleItineraryDayFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ itineraryDayId: z.string() }))
  .handler(async ({ data }) => {
    const day = await getItineraryDay(data.itineraryDayId)

    return day
  })

export const createItineraryDaysFn = createServerFn({ method: 'POST' })
  .inputValidator(insertItineraryDaySchema.array())
  .handler(async ({ data }) => {
    const newItineraryDays = await createItineraryDays(data)

    return newItineraryDays
  })

export const updateSingleItineraryDayFn = createServerFn({ method: 'POST' })
  .inputValidator(updateItineraryDaySchema)
  .handler(async ({ data }) => {
    const updatedItineraryDay = await updateSingleItineraryDay(data)

    return updatedItineraryDay
  })

export const updateMultipleItineraryDaysFn = createServerFn({ method: 'POST' })
  .inputValidator(insertItineraryDaySchema.array())
  .handler(async ({ data }) => {
    const updatedItineraryDays = await updateMultipleItineraryDays(data)

    return updatedItineraryDays
  })

export const deleteItineraryDayFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ itineraryDayId: z.string() }))
  .handler(async ({ data }) => {
    const deletedItineraryDay = await deleteItineraryDay(data.itineraryDayId)

    return deletedItineraryDay
  })
