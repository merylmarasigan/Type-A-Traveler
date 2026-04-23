import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  createCityItineraryMutationOptions,
  folderCityItinerariesQueryOptions,
  searchCityItinerariesQueryOptions,
} from '@/services/backend/city-itineraries.options'

type UseCityItinerariesParams = {
  folderId?: string
  searchQuery?: string
}

export const useCityItineraries = ({
  folderId,
  searchQuery,
}: UseCityItinerariesParams = {}) => {
  const itinerariesQuery = useSuspenseQuery(
    folderCityItinerariesQueryOptions({ folderId }),
  )

  const createCityItineraryMutation = useMutation(
    createCityItineraryMutationOptions(),
  )

  const searchResultsQuery = useSuspenseQuery(
    searchCityItinerariesQueryOptions(searchQuery),
  )

  return {
    itinerariesQuery,
    createCityItineraryMutation,
    searchResultsQuery,
  }
}
