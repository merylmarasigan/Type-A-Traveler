import {
  createItineraryFolderMutationOptions,
  multipleItineraryFoldersQueryOptions,
  userItineraryFoldersQueryOptions,
} from '@/services/backend/itinerary-folders.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useItineraryFolders = (userId?: string) => {
  const foldersQuery = useSuspenseQuery(multipleItineraryFoldersQueryOptions())

  const userFoldersQuery = useSuspenseQuery(
    userItineraryFoldersQueryOptions(userId),
  )

  const createFolderMutation = useMutation(
    createItineraryFolderMutationOptions(),
  )

  return {
    foldersQuery,
    userFoldersQuery,
    createFolderMutation,
  }
}
