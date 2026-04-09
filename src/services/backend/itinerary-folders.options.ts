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
import { toast } from 'sonner'

const multipleItineraryFoldersQueryKey = () => ['itinerary_folders'] as const

const singleItineraryFolderQueryKey = (itineraryFolderId?: string) =>
  ['itinerary_folders', itineraryFolderId] as const

export const userItineraryFoldersQueryKey = (userId?: string) => [
  'users',
  userId,
  ...multipleItineraryFoldersQueryKey(),
]

export const multipleItineraryFoldersQueryOptions = (limit?: number) =>
  queryOptions({
    queryKey: multipleItineraryFoldersQueryKey(),
    queryFn: () => getMultipleItineraryFoldersFn({ data: { limit } }),
  })

export const userItineraryFoldersQueryOptions = (userId?: string) =>
  queryOptions({
    queryKey: userItineraryFoldersQueryKey(userId),
    queryFn: () => getUserItineraryFoldersFn({ data: { userId } }),
    enabled: userId !== undefined && userId !== '',
  })

export const singleItineraryFolderQueryOptions = (itineraryFolderId: string) =>
  queryOptions({
    queryKey: singleItineraryFolderQueryKey(itineraryFolderId),
    queryFn: () => getSingleItineraryFolderFn({ data: { itineraryFolderId } }),
    enabled: !!itineraryFolderId,
  })

export const createItineraryFolderMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createItineraryFolder'],
    mutationFn: (data: NewItineraryFolder) => createItineraryFolderFn({ data }),
    onSuccess: async (_data, _variables, _result, ctx) => {
      await ctx.client.invalidateQueries({
        queryKey: multipleItineraryFoldersQueryKey(),
      })
    },
  })

export const updateItineraryFolderMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateItineraryFolder'],
    mutationFn: (data: UpdateItineraryFolder) =>
      updateItineraryFolderFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Updated ${data.title}`)

      await ctx.client.invalidateQueries({
        queryKey: singleItineraryFolderQueryKey(data.id),
      })
    },
  })

export const deleteItineraryFolderMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteItineraryFolder'],
    mutationFn: (itineraryFolderId: string) =>
      deleteItineraryFolderFn({ data: { itineraryFolderId } }),
    onSuccess: async (_data, _variables, _result, ctx) => {
      toast.success('Deleted itinerary folder')

      await ctx.client.invalidateQueries({
        queryKey: multipleItineraryFoldersQueryKey(),
      })
    },
  })
