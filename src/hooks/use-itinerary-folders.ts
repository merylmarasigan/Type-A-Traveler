import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { authClient } from '@/lib/auth-client'
import {
  createItineraryFolderMutationOptions,
  multipleItineraryFoldersQueryOptions,
  userItineraryFoldersQueryOptions,
} from '@/services/backend/itinerary-folders.options'

type UseItineraryFoldersParams = {
  limit?: number
  publicOnly?: boolean
}

export const useItineraryFolders = ({
  limit,
  publicOnly,
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

  return {
    foldersQuery,
    userFoldersQuery,
    createFolderMutation,
  }
}
