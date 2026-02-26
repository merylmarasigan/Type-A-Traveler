import {
  deleteCityItineraryMutationOptions,
  singleCityItineraryQueryOptions,
  updateCityItineraryMutationOptions,
} from '@/services/backend/city-itineraries.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

interface UseCityItineraryOptions {
  folderId: string
  cityItineraryId: string
}

export const useCityItinerary = ({
  folderId,
  cityItineraryId,
}: UseCityItineraryOptions) => {
  const itineraryQuery = useSuspenseQuery(
    singleCityItineraryQueryOptions(folderId, cityItineraryId),
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
