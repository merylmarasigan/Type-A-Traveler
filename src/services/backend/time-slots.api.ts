import {
  createTimeSlot,
  deleteTimeSlot,
  getTimeSlot,
  getItineraryDayTimeSlots,
  updateTimeSlot,
} from '@/db/queries/time-slots'
import { insertTimeSlotSchema, updateTimeSlotSchema } from '@/db/types'
import { ensureSession } from '@/services/backend/auth.functions'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'

export const getItineraryDayTimeSlotsFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ itineraryDayId: z.string() }))
  .handler(async ({ data }) => {
    const timeSlots = await getItineraryDayTimeSlots(data.itineraryDayId)

    return timeSlots
  })

export const getSingleTimeSlotFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ timeSlotId: z.string() }))
  .handler(async ({ data }) => {
    const timeSlot = await getTimeSlot(data.timeSlotId)

    return timeSlot
  })

export const createTimeSlotFn = createServerFn({ method: 'POST' })
  .inputValidator(insertTimeSlotSchema)
  .handler(async ({ data }) => {
    await ensureSession()

    const newTimeSlot = await createTimeSlot(data)

    return newTimeSlot
  })

export const updateTimeSlotFn = createServerFn({ method: 'POST' })
  .inputValidator(updateTimeSlotSchema)
  .handler(async ({ data }) => {
    await ensureSession()

    const updatedTimeSlot = await updateTimeSlot(data)

    return updatedTimeSlot
  })

export const deleteTimeSlotFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ timeSlotId: z.string() }))
  .handler(async ({ data }) => {
    await ensureSession()

    const deletedTimeSlot = await deleteTimeSlot(data.timeSlotId)

    return deletedTimeSlot
  })
