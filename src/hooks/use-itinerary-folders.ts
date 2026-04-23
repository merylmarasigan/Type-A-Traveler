import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import {
  createItineraryFolderMutationOptions,
  multipleItineraryFoldersQueryOptions,
  searchItineraryFoldersQueryOptions,
  userItineraryFoldersQueryOptions,
} from '@/services/backend/itinerary-folders.options'

type UseItineraryFoldersParams = {
  limit?: number
  publicOnly?: boolean
  searchQuery?: string
}

export const useItineraryFolders = ({
  limit,
  publicOnly,
  searchQuery,
}: UseItineraryFoldersParams = {}) => {
  const { data } = authClient.useSession()

  const foldersQuery = useSuspenseQuery(
    multipleItineraryFoldersQueryOptions({ limit, publicOnly }),
  )

  const userFoldersQuery = useSuspenseQuery(
    userItineraryFoldersQueryOptions({ userId: data?.session.userId }),
  )

  const createFolderMutation = useMutation(
    createItineraryFolderMutationOptions(),
  )

  const searchResultsQuery = useSuspenseQuery(
    searchItineraryFoldersQueryOptions(searchQuery),
  )

  return {
    foldersQuery,
    userFoldersQuery,
    createFolderMutation,
    searchResultsQuery,
  }
}
