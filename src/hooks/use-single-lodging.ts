import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteLodgingMutationOptions,
  singleLodgingQueryOptions,
  updateLodgingMutationOptions,
} from '@/services/backend/lodging.options'

export const useSingleLodging = (lodgingId: string) => {
  const lodgingQuery = useSuspenseQuery(singleLodgingQueryOptions(lodgingId))

  const updateLodgingMutation = useMutation(updateLodgingMutationOptions())

  const deleteLodgingMutation = useMutation(deleteLodgingMutationOptions())

  return {
    lodgingQuery,
    updateLodgingMutation,
    deleteLodgingMutation,
  }
}
