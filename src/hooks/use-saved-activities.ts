import {
  createSavedActivityMutationOptions,
  userSavedActivitiesQueryOptions,
} from '@/services/backend/saved-activities.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useSavedActivities = (userId: string, city?: string) => {
  const activitiesQuery = useSuspenseQuery(
    userSavedActivitiesQueryOptions(userId, city),
  )

  const createSavedActivityMutation = useMutation(
    createSavedActivityMutationOptions(),
  )

  return {
    activitiesQuery,
    createSavedActivityMutation,
  }
}
