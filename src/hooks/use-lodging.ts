import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  createLodgingMutationOptions,
  folderLodgingQueryOptions,
} from '@/services/backend/lodging.options'

type UseLodgingParams = {
  folderId: string
}

export const useLodging = ({ folderId }: UseLodgingParams) => {
  const lodgingQuery = useSuspenseQuery(
    folderLodgingQueryOptions({ itineraryFolderId: folderId }),
  )

  const createLodgingMutation = useMutation(createLodgingMutationOptions())

  return {
    lodgingQuery,
    createLodgingMutation,
  }
}
