import { NewCityItinerary, UpdateCityItinerary } from '@/db/types'
import {
  createCityItineraryFn,
  getSingleCityItineraryFn,
  updateCityItineraryFn,
  deleteCityItineraryFn,
  getFolderCityItinerariesFn,
} from '@/services/backend/city-itineraries.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

export const folderCityItinerariesQueryOptions = (folderId: string) =>
  queryOptions({
    queryKey: ['itinerary_folders', folderId, 'city_itineraries'],
    queryFn: () => getFolderCityItinerariesFn({ data: { folderId } }),
    enabled: folderId !== '',
  })

export const singleCityItineraryQueryOptions = (
  folderId: string,
  cityItineraryId: string,
) =>
  queryOptions({
    queryKey: [
      'itinerary_folders',
      folderId,
      'city_itineraries',
      cityItineraryId,
    ],
    queryFn: () => getSingleCityItineraryFn({ data: { cityItineraryId } }),
    enabled: cityItineraryId !== '',
  })

export const createCityItineraryMutationOptions = (data: NewCityItinerary) =>
  mutationOptions({
    mutationFn: () => createCityItineraryFn({ data }),
    mutationKey: ['createCityItinerary'],
    onSuccess: async (_data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_folders', data.folderId, 'city_itineraries'],
      }),
  })

export const updateCityItineraryMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: UpdateCityItinerary) => updateCityItineraryFn({ data }),
    mutationKey: ['updateCityItinerary'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: [
          'itinerary_folders',
          data.folderId,
          'city_itineraries',
          data.id,
        ],
      }),
  })

export const deleteCityItineraryMutationOptions = () =>
  mutationOptions({
    mutationFn: (cityItineraryId: string) =>
      deleteCityItineraryFn({ data: { cityItineraryId } }),
    mutationKey: ['deleteCityItinerary'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_folders', data.folderId, 'city_itineraries'],
      }),
  })
