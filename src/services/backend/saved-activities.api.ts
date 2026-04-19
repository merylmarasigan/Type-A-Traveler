import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'
import {
  createSavedActivity,
  deleteSavedActivity,
  getActivitiesForTimeSlot,
  getCityItinerarySavedActivities,
  getSavedActivity,
  getTimeSlotActivity,
  getUnlinkedActivitiesForTimeSlot,
  getUserSavedActivities,
  linkActivityToTimeSlot,
  unlinkActivityFromTimeSlot,
  updateSavedActivity,
  updateTimeSlotActivityNote,
} from '@/db/queries/saved-activities'
import {
  insertSavedActivitySchema,
  updateSavedActivitySchema,
} from '@/db/types'
import { ensureSession } from '@/services/backend/auth.functions'

export const getUserSavedActivitiesFn = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      userId: z.string().optional(),
      city: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!data.userId) return []

    const activities = await getUserSavedActivities(data.userId, data.city)

    return activities
  })

export const getCityItinerarySavedActivitiesFn = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      cityItineraryId: z.string().optional(),
    }),
  )
  .handler(async ({ data }) => {
    if (!data.cityItineraryId) return []

    const activities = await getCityItinerarySavedActivities(
      data.cityItineraryId,
    )

    return activities
  })

export const getTimeSlotActivitiesFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ timeSlotId: z.string() }))
  .handler(async ({ data }) => {
    const activities = await getActivitiesForTimeSlot(data.timeSlotId)

    return activities
  })

export const getUnlinkedActivitiesForTimeSlotFn = createServerFn({
  method: 'GET',
})
  .inputValidator(
    z.object({
      timeSlotId: z.string(),
      userId: z.string(),
      city: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const activities = await getUnlinkedActivitiesForTimeSlot(
      data.timeSlotId,
      data.userId,
      data.city,
    )

    return activities
  })

export const getSingleSavedActivityFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ savedActivityId: z.string() }))
  .handler(async ({ data }) => {
    const activity = await getSavedActivity(data.savedActivityId)

    return activity
  })

export const createSavedActivityFn = createServerFn({ method: 'POST' })
  .inputValidator(insertSavedActivitySchema)
  .handler(async ({ data }) => {
    await ensureSession()

    const newActivity = await createSavedActivity(data)

    return newActivity
  })

export const updateSavedActivityFn = createServerFn({ method: 'POST' })
  .inputValidator(updateSavedActivitySchema)
  .handler(async ({ data }) => {
    await ensureSession()

    const updatedActivity = await updateSavedActivity(data)

    return updatedActivity
  })

export const deleteSavedActivityFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ savedActivityId: z.string() }))
  .handler(async ({ data }) => {
    await ensureSession()

    const deletedActivity = await deleteSavedActivity(data.savedActivityId)

    return deletedActivity
  })

export const linkActivityToTimeSlotFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({ savedActivityId: z.string(), timeSlotId: z.string() }),
  )
  .handler(async ({ data }) => {
    await ensureSession()

    const link = await linkActivityToTimeSlot(
      data.savedActivityId,
      data.timeSlotId,
    )

    return link
  })

export const unlinkActivityFromTimeSlotFn = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({ savedActivityId: z.string(), timeSlotId: z.string() }),
  )
  .handler(async ({ data }) => {
    await ensureSession()

    const result = await unlinkActivityFromTimeSlot(
      data.savedActivityId,
      data.timeSlotId,
    )

    return result
  })

export const getTimeSlotActivityFn = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({ savedActivityId: z.string(), timeSlotId: z.string() }),
  )
  .handler(async ({ data }) => {
    const result = await getTimeSlotActivity(
      data.savedActivityId,
      data.timeSlotId,
    )

    return result
  })

export const updateTimeSlotActivityNoteFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ id: z.string(), note: z.string().nullable() }))
  .handler(async ({ data }) => {
    await ensureSession()

    const result = await updateTimeSlotActivityNote(data.id, data.note)

    return result
  })
