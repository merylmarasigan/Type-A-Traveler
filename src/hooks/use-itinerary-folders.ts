import {
  createItineraryFolderMutationOptions,
  multipleItineraryFoldersQueryOptions,
} from '@/services/backend/itinerary-folders.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useItineraryFolders = () => {
  const foldersQuery = useSuspenseQuery(multipleItineraryFoldersQueryOptions())

  const createFolderMutation = useMutation(
    createItineraryFolderMutationOptions(),
  )

  return {
    foldersQuery,
    createFolderMutation,
  }
}
