import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  createCityItineraryMutationOptions,
  folderCityItinerariesQueryOptions,
} from '@/services/backend/city-itineraries.options'

type UseCityItinerariesParams = {
  folderId?: string
}

export const useCityItineraries = ({
  folderId,
}: UseCityItinerariesParams = {}) => {
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
