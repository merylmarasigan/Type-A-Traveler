import {
  deleteCityItineraryMutationOptions,
  singleCityItineraryQueryOptions,
  updateCityItineraryMutationOptions,
} from '@/services/backend/city-itineraries.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useSingleCityItinerary = (cityItineraryId: string) => {
  const itineraryQuery = useSuspenseQuery(
    singleCityItineraryQueryOptions(cityItineraryId),
  )

  const updateItineraryMutation = useMutation(
    updateCityItineraryMutationOptions(),
  )

  const deleteItineraryMutation = useMutation(
    deleteCityItineraryMutationOptions(),
  )

  return {
    itineraryQuery,
    updateItineraryMutation,
    deleteItineraryMutation,
  }
}
