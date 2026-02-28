import {
  createLodgingMutationOptions,
  folderLodgingQueryOptions,
} from '@/services/backend/lodging.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useLodging = (folderId: string) => {
  const lodgingQuery = useSuspenseQuery(folderLodgingQueryOptions(folderId))

  const createLodgingMutation = useMutation(createLodgingMutationOptions())

  return {
    lodgingQuery,
    createLodgingMutation,
  }
}
