import {
  deleteSavedActivityMutationOptions,
  singleSavedActivityQueryOptions,
  updateSavedActivityMutationOptions,
} from '@/services/backend/saved-activities.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useSavedActivity = (id: string) => {
  const activityQuery = useSuspenseQuery(singleSavedActivityQueryOptions(id))

  const updateActivityMutation = useMutation(
    updateSavedActivityMutationOptions(),
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
