import { NewItineraryFolder, UpdateItineraryFolder } from '@/db/types'
import {
  createItineraryFolderFn,
  getSingleItineraryFolderFn,
  getMultipleItineraryFoldersFn,
  getUserItineraryFoldersFn,
  updateItineraryFolderFn,
  deleteItineraryFolderFn,
} from '@/services/backend/itinerary-folders.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

export const multipleItineraryFoldersQueryOptions = (limit?: number) =>
  queryOptions({
    queryKey: ['itinerary_folders'],
    queryFn: () => getMultipleItineraryFoldersFn({ data: { limit } }),
  })

export const userItineraryFoldersQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['users', userId, 'itinerary_folders'],
    queryFn: () => getUserItineraryFoldersFn({ data: { userId } }),
    enabled: userId !== '',
  })

export const singleItineraryFolderQueryOptions = (itineraryFolderId: string) =>
  queryOptions({
    queryKey: ['itinerary_folders', itineraryFolderId],
    queryFn: () => getSingleItineraryFolderFn({ data: { itineraryFolderId } }),
    enabled: itineraryFolderId !== '',
  })

export const createItineraryFolderMutationOptions = (
  data: NewItineraryFolder,
) =>
  mutationOptions({
    mutationFn: () => createItineraryFolderFn({ data }),
    mutationKey: ['createItineraryFolder'],
    onSuccess: async (_data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_folders'],
      }),
  })

export const updateItineraryFolderMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: UpdateItineraryFolder) =>
      updateItineraryFolderFn({ data }),
    mutationKey: ['updateItineraryFolder'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_folders', data.id],
      }),
  })

export const deleteItineraryFolderMutationOptions = () =>
  mutationOptions({
    mutationFn: (itineraryFolderId: string) =>
      deleteItineraryFolderFn({ data: { itineraryFolderId } }),
    mutationKey: ['deleteItineraryFolder'],
    onSuccess: async (_data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_folders'],
      }),
  })
