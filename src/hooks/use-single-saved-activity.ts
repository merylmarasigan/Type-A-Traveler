import {
  deleteSavedActivityMutationOptions,
  singleSavedActivityQueryOptions,
  updateSavedActivityMutationOptions,
} from '@/services/backend/saved-activities.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useSingleSavedActivity = (
  savedActivityId: string,
  cityItineraryId?: string,
) => {
  const activityQuery = useSuspenseQuery(
    singleSavedActivityQueryOptions(savedActivityId),
  )

  const updateActivityMutation = useMutation(
    updateSavedActivityMutationOptions(cityItineraryId),
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
