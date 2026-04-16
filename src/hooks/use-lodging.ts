import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  createLodgingMutationOptions,
  folderLodgingQueryOptions,
} from '@/services/backend/lodging.options'

export const useLodging = (folderId: string) => {
  const lodgingQuery = useSuspenseQuery(folderLodgingQueryOptions(folderId))

  const createLodgingMutation = useMutation(createLodgingMutationOptions())

  return {
    lodgingQuery,
    createLodgingMutation,
  }
}
