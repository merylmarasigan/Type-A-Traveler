import {
  deleteLodgingMutationOptions,
  singleLodgingQueryOptions,
  updateLodgingMutationOptions,
} from '@/services/backend/lodging.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useLodging = (lodgingId: string) => {
  const lodgingQuery = useSuspenseQuery(singleLodgingQueryOptions(lodgingId))

  const updateLodgingMutation = useMutation(updateLodgingMutationOptions())

  const deleteLodgingMutation = useMutation(deleteLodgingMutationOptions())

  return {
    lodgingQuery,
    updateLodgingMutation,
    deleteLodgingMutation,
  }
}
