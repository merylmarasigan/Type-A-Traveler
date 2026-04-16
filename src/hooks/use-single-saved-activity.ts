import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteSavedActivityMutationOptions,
  singleSavedActivityQueryOptions,
  updateSavedActivityMutationOptions,
} from '@/services/backend/saved-activities.options'

type UseSingleSavedActivityParams = {
  savedActivityId: string
  cityItineraryId?: string
  userId?: string
  city?: string
}

export const useSingleSavedActivity = ({
  savedActivityId,
  cityItineraryId,
  userId,
  city,
}: UseSingleSavedActivityParams) => {
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
