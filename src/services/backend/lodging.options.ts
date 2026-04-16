import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { NewLodging, UpdateLodging } from '@/db/types'
import {
  createLodgingFn,
  deleteLodgingFn,
  getItineraryLodgingFn,
  getSingleLodgingFn,
  updateLodgingFn,
} from '@/services/backend/lodging.api'

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
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Added ${data.name} to lodging`)

      await ctx.client.invalidateQueries({
        queryKey: multipleLodgingQueryKey(data.itineraryId),
      })
    },
  })

export const updateLodgingMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateLodging'],
    mutationFn: (data: UpdateLodging) => updateLodgingFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Updated ${data.name}`)

      await ctx.client.invalidateQueries({
        queryKey: singleLodgingQueryKey(data.id),
      })
    },
  })

export const deleteLodgingMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteLodging'],
    mutationFn: (lodgingId: string) => deleteLodgingFn({ data: { lodgingId } }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Deleted ${data.name} from lodging`)

      await ctx.client.invalidateQueries({
        queryKey: multipleLodgingQueryKey(data.itineraryId),
      })
    },
  })
