import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  createCityItineraryMutationOptions,
  folderCityItinerariesQueryOptions,
} from '@/services/backend/city-itineraries.options'

export const useCityItineraries = (folderId?: string) => {
  const itinerariesQuery = useSuspenseQuery(
    folderCityItinerariesQueryOptions(folderId),
  )

  const createCityItineraryMutation = useMutation(
    createCityItineraryMutationOptions(),
  )

  return {
    itinerariesQuery,
    createCityItineraryMutation,
  }
}
