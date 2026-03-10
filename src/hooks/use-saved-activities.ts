import { authClient } from '@/lib/auth-client'
import {
  cityItinerarySavedActivitiesQueryOptions,
  createSavedActivityMutationOptions,
  userSavedActivitiesQueryOptions,
} from '@/services/backend/saved-activities.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

interface UseSavedActivitiesParams {
  city?: string
  cityItineraryId?: string
}

export const useSavedActivities = ({
  city,
  cityItineraryId,
}: UseSavedActivitiesParams) => {
  const { data } = authClient.useSession()

  const userActivitiesQuery = useSuspenseQuery(
    userSavedActivitiesQueryOptions(data?.user.id, city),
  )

  const createSavedActivityMutation = useMutation(
    createSavedActivityMutationOptions(),
  )

  const cityActivitiesQuery = useSuspenseQuery(
    cityItinerarySavedActivitiesQueryOptions(cityItineraryId),
  )

  return {
    userActivitiesQuery,
    cityActivitiesQuery,
    createSavedActivityMutation,
  }
}
