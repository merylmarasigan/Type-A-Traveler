import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import {
  deleteCityItineraryMutationOptions,
  singleCityItineraryQueryOptions,
  updateCityItineraryMutationOptions,
} from '@/services/backend/city-itineraries.options'

type UseSingleCityItineraryParams = {
  cityItineraryId: string
}

export const useSingleCityItinerary = ({
  cityItineraryId,
}: UseSingleCityItineraryParams) => {
  const { data } = authClient.useSession()

  const itineraryQuery = useSuspenseQuery(
    singleCityItineraryQueryOptions(cityItineraryId),
  )

  const updateItineraryMutation = useMutation(
    updateCityItineraryMutationOptions(),
  )

  const deleteItineraryMutation = useMutation(
    deleteCityItineraryMutationOptions(data?.user.id),
  )

  return {
    itineraryQuery,
    updateItineraryMutation,
    deleteItineraryMutation,
  }
}
