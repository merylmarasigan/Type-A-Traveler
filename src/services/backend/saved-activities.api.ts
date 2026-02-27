import {
  createSavedActivity,
  deleteSavedActivity,
  getSavedActivity,
  getUserSavedActivities,
  updateSavedActivity,
} from '@/db/queries/saved-activities'
import {
  insertSavedActivitySchema,
  updateSavedActivitySchema,
} from '@/db/types'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'

export const getUserSavedActivitiesFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const activities = await getUserSavedActivities(data.userId)

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
    const newActivity = await createSavedActivity(data)

    return newActivity
  })

export const updateSavedActivityFn = createServerFn({ method: 'POST' })
  .inputValidator(updateSavedActivitySchema)
  .handler(async ({ data }) => {
    const updatedActivity = await updateSavedActivity(data)

    return updatedActivity
  })

export const deleteSavedActivityFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ savedActivityId: z.string() }))
  .handler(async ({ data }) => {
    await deleteSavedActivity(data.savedActivityId)
  })
