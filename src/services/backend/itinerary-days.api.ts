import {
  createItineraryDay,
  deleteItineraryDay,
  getItineraryDay,
  getCityItineraryDays,
  updateItineraryDay,
} from '@/db/queries/itinerary-days'
import { insertItineraryDaySchema, updateItineraryDaySchema } from '@/db/types'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'

export const getCityItineraryDaysFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ cityItineraryId: z.string() }))
  .handler(async ({ data }) => {
    const days = await getCityItineraryDays(data.cityItineraryId)

    return days
  })

export const getSingleItineraryDayFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ itineraryDayId: z.string() }))
  .handler(async ({ data }) => {
    const day = await getItineraryDay(data.itineraryDayId)

    return day
  })

export const createItineraryDayFn = createServerFn({ method: 'POST' })
  .inputValidator(insertItineraryDaySchema)
  .handler(async ({ data }) => {
    const newItineraryDay = await createItineraryDay(data)

    return newItineraryDay
  })

export const updateItineraryDayFn = createServerFn({ method: 'POST' })
  .inputValidator(updateItineraryDaySchema)
  .handler(async ({ data }) => {
    const updatedItineraryDay = await updateItineraryDay(data)

    return updatedItineraryDay
  })

export const deleteItineraryDayFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ itineraryDayId: z.string() }))
  .handler(async ({ data }) => {
    const deletedItineraryDay = await deleteItineraryDay(data.itineraryDayId)

    return deletedItineraryDay
  })
