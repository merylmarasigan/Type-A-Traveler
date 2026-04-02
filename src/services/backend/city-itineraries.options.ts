import { NewCityItinerary, UpdateCityItinerary } from '@/db/types'
import {
  createCityItineraryFn,
  getSingleCityItineraryFn,
  updateCityItineraryFn,
  deleteCityItineraryFn,
  getFolderCityItinerariesFn,
} from '@/services/backend/city-itineraries.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

const multipleCityItinerariesQueryKey = (folderId?: string) =>
  ['itinerary_folders', folderId, 'city_itineraries'] as const

const singleCityItineraryQueryKey = (cityItineraryId?: string) =>
  ['city_itineraries', cityItineraryId] as const

export const folderCityItinerariesQueryOptions = (folderId?: string) =>
  queryOptions({
    queryKey: multipleCityItinerariesQueryKey(folderId),
    queryFn: () => getFolderCityItinerariesFn({ data: { folderId } }),
    enabled: folderId !== undefined && folderId !== '',
  })

export const singleCityItineraryQueryOptions = (cityItineraryId: string) =>
  queryOptions({
    queryKey: singleCityItineraryQueryKey(cityItineraryId),
    queryFn: () => getSingleCityItineraryFn({ data: { cityItineraryId } }),
    enabled: !!cityItineraryId,
  })

export const createCityItineraryMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createCityItinerary'],
    mutationFn: (data: NewCityItinerary) => createCityItineraryFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleCityItinerariesQueryKey(data.folderId),
      }),
  })

export const updateCityItineraryMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateCityItinerary'],
    mutationFn: (data: UpdateCityItinerary) => updateCityItineraryFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: singleCityItineraryQueryKey(data.id),
      }),
  })

export const deleteCityItineraryMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteCityItinerary'],
    mutationFn: (cityItineraryId: string) =>
      deleteCityItineraryFn({ data: { cityItineraryId } }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleCityItinerariesQueryKey(data.folderId),
      }),
  })
