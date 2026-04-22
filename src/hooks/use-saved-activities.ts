import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import {
  cityItinerarySavedActivitiesQueryOptions,
  createSavedActivityMutationOptions,
  userSavedActivitiesQueryOptions,
} from '@/services/backend/saved-activities.options'

interface UseSavedActivitiesParams {
  city?: string
  cityItineraryId?: string
  /** When set, load this user's saved activities (e.g. public profile). Defaults to the signed-in user. */
  forUserId?: string
  userShowsSavedActivitiesOnProfile?: boolean
}

export const useSavedActivities = ({
  city,
  cityItineraryId,
  forUserId,
  userShowsSavedActivitiesOnProfile,
}: UseSavedActivitiesParams) => {
  const { data } = authClient.useSession()

  const userId = forUserId ?? data?.user.id ?? ''

  const userActivitiesQuery = useSuspenseQuery(
    userSavedActivitiesQueryOptions({
      userId,
      city,
      userShowsSavedActivitiesOnProfile,
    }),
  )

  const cityActivitiesQuery = useSuspenseQuery(
    cityItinerarySavedActivitiesQueryOptions({ cityItineraryId }),
  )

  const createSavedActivityMutation = useMutation(
    createSavedActivityMutationOptions({ cityItineraryId }),
  )

  return {
    userActivitiesQuery,
    cityActivitiesQuery,
    createSavedActivityMutation,
  }
}
