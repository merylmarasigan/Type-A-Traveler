import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { NewCityItinerary, UpdateCityItinerary } from '@/db/types'
import {
  createCityItineraryFn,
  deleteCityItineraryFn,
  getFolderCityItinerariesFn,
  getSingleCityItineraryFn,
  updateCityItineraryFn,
} from '@/services/backend/city-itineraries.api'
import { userItineraryFoldersQueryKey } from '@/services/backend/itinerary-folders.options'

const multipleCityItinerariesQueryKey = (folderId?: string) =>
  ['itinerary_folders', folderId, 'city_itineraries'] as const

const singleCityItineraryQueryKey = (cityItineraryId?: string) =>
  ['city_itineraries', cityItineraryId] as const

export const folderCityItinerariesQueryOptions = ({
  folderId,
}: {
  folderId?: string
}) =>
  queryOptions({
    queryKey: multipleCityItinerariesQueryKey(folderId),
    queryFn: () => getFolderCityItinerariesFn({ data: { folderId } }),
    enabled: folderId !== undefined && folderId !== '',
  })

export const singleCityItineraryQueryOptions = ({
  cityItineraryId,
}: {
  cityItineraryId: string
}) =>
  queryOptions({
    queryKey: singleCityItineraryQueryKey(cityItineraryId),
    queryFn: () => getSingleCityItineraryFn({ data: { cityItineraryId } }),
    enabled: !!cityItineraryId,
  })

export const createCityItineraryMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createCityItinerary'],
    mutationFn: (data: NewCityItinerary) => createCityItineraryFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Created new itinerary for ${data.city}!`)

      await ctx.client.invalidateQueries({
        queryKey: multipleCityItinerariesQueryKey(data.folderId),
      })
    },
  })

export const updateCityItineraryMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateCityItinerary'],
    mutationFn: (data: UpdateCityItinerary) => updateCityItineraryFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Updated itinerary for ${data.city}`)

      await ctx.client.invalidateQueries({
        queryKey: singleCityItineraryQueryKey(data.id),
      })
    },
  })

export const deleteCityItineraryMutationOptions = ({
  userId,
}: {
  userId?: string
}) =>
  mutationOptions({
    mutationKey: ['deleteCityItinerary'],
    mutationFn: (cityItineraryId: string) =>
      deleteCityItineraryFn({ data: { cityItineraryId } }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Deleted itinerary for ${data.deletedCityItinerary.city}`)

      await ctx.client.invalidateQueries({
        queryKey: multipleCityItinerariesQueryKey(
          data.deletedCityItinerary.folderId,
        ),
      })
      await ctx.client.invalidateQueries({
        queryKey: multipleCityItinerariesQueryKey(
          data.deletedCityItinerary.folderId,
        ),
      })

      await ctx.client.invalidateQueries({
        queryKey: userItineraryFoldersQueryKey(userId),
      })
    },
  })
