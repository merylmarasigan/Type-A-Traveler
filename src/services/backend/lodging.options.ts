import { NewLodging, UpdateLodging } from '@/db/types'
import {
  createLodgingFn,
  getSingleLodgingFn,
  updateLodgingFn,
  deleteLodgingFn,
  getItineraryLodgingFn,
} from '@/services/backend/lodging.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

const multipleLodgingQueryKey = (itineraryFolderId: string) =>
  ['itinerary_folders', itineraryFolderId, 'lodging'] as const

const singleLodgingQueryKey = (lodgingId: string) =>
  ['lodging', lodgingId] as const

export const folderLodgingQueryOptions = (itineraryFolderId: string) =>
  queryOptions({
    queryKey: multipleLodgingQueryKey(itineraryFolderId),
    queryFn: () => getItineraryLodgingFn({ data: { itineraryFolderId } }),
    enabled: itineraryFolderId !== '',
  })

export const singleLodgingQueryOptions = (lodgingId: string) =>
  queryOptions({
    queryKey: singleLodgingQueryKey(lodgingId),
    queryFn: () => getSingleLodgingFn({ data: { lodgingId } }),
    enabled: lodgingId !== '',
  })

export const createLodgingMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createLodging'],
    mutationFn: (data: NewLodging) => createLodgingFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleLodgingQueryKey(data.itineraryId),
      }),
  })

export const updateLodgingMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateLodging'],
    mutationFn: (data: UpdateLodging) => updateLodgingFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: singleLodgingQueryKey(data.id),
      }),
  })

export const deleteLodgingMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteLodging'],
    mutationFn: (lodgingId: string) => deleteLodgingFn({ data: { lodgingId } }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleLodgingQueryKey(data.itineraryId),
      }),
  })
