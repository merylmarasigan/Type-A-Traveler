import {
  createSavedActivity,
  deleteSavedActivity,
  getCityItinerarySavedActivities,
  getSavedActivity,
  getUserSavedActivities,
  updateSavedActivity,
} from '@/db/queries/saved-activities'
import {
  insertSavedActivitySchema,
  updateSavedActivitySchema,
} from '@/db/types'
import { ensureSession } from '@/services/backend/auth.functions'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'

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
