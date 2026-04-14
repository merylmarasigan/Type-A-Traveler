import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import {
  createItineraryFolderMutationOptions,
  multipleItineraryFoldersQueryOptions,
  userItineraryFoldersQueryOptions,
} from '@/services/backend/itinerary-folders.options'

export const useItineraryFolders = (limit?: number) => {
  const { data } = authClient.useSession()

  const foldersQuery = useSuspenseQuery(
    multipleItineraryFoldersQueryOptions(limit),
  )

  const userFoldersQuery = useSuspenseQuery(
    userItineraryFoldersQueryOptions(data?.session.userId),
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
