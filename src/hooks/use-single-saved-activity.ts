import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteSavedActivityMutationOptions,
  singleSavedActivityQueryOptions,
  updateSavedActivityMutationOptions,
} from '@/services/backend/saved-activities.options'

export const useSingleSavedActivity = (
  savedActivityId: string,
  cityItineraryId?: string,
  userId?: string,
  city?: string,
) => {
  const activityQuery = useSuspenseQuery(
    singleSavedActivityQueryOptions(savedActivityId),
  )

  const updateActivityMutation = useMutation(
    updateSavedActivityMutationOptions(cityItineraryId, userId, city),
  )

  const deleteActivityMutation = useMutation(
    deleteSavedActivityMutationOptions(),
  )

  return {
    activityQuery,
    updateActivityMutation,
    deleteActivityMutation,
  }
}
