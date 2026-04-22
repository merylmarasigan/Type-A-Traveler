import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import {
  createItineraryFolderMutationOptions,
  multipleItineraryFoldersQueryOptions,
  userItineraryFoldersQueryOptions,
} from '@/services/backend/itinerary-folders.options'

type UseItineraryFoldersParams = {
  limit?: number
}

export const useItineraryFolders = ({
  limit,
}: UseItineraryFoldersParams = {}) => {
  const { data } = authClient.useSession()

  const foldersQuery = useSuspenseQuery(
    multipleItineraryFoldersQueryOptions({ limit }),
  )

  const userFoldersQuery = useSuspenseQuery(
    userItineraryFoldersQueryOptions({ userId: data?.session.userId }),
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
