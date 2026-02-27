import { NewLodging, UpdateLodging } from '@/db/types'
import {
  createLodgingFn,
  getSingleLodgingFn,
  updateLodgingFn,
  deleteLodgingFn,
  getItineraryLodgingFn,
} from '@/services/backend/lodging.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

export const folderLodgingQueryOptions = (itineraryFolderId: string) =>
  queryOptions({
    queryKey: ['itinerary_folders', itineraryFolderId, 'lodging'],
    queryFn: () => getItineraryLodgingFn({ data: { itineraryFolderId } }),
    enabled: itineraryFolderId !== '',
  })

export const singleLodgingQueryOptions = (lodgingId: string) =>
  queryOptions({
    queryKey: ['lodging', lodgingId],
    queryFn: () => getSingleLodgingFn({ data: { lodgingId } }),
    enabled: lodgingId !== '',
  })

export const createLodgingMutationOptions = (data: NewLodging) =>
  mutationOptions({
    mutationFn: () => createLodgingFn({ data }),
    mutationKey: ['createLodging'],
    onSuccess: async (_data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_folders', data.itineraryId, 'lodging'],
      }),
  })

export const updateLodgingMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: UpdateLodging) => updateLodgingFn({ data }),
    mutationKey: ['updateLodging'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['lodging', data.id],
      }),
  })

export const deleteLodgingMutationOptions = () =>
  mutationOptions({
    mutationFn: (lodgingId: string) => deleteLodgingFn({ data: { lodgingId } }),
    mutationKey: ['deleteLodging'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_folders', data.itineraryId, 'lodging'],
      }),
  })
