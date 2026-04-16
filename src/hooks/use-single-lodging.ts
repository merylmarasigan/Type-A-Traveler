import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteLodgingMutationOptions,
  singleLodgingQueryOptions,
  updateLodgingMutationOptions,
} from '@/services/backend/lodging.options'

type UseSingleLodgingParams = {
  lodgingId: string
}

export const useSingleLodging = ({ lodgingId }: UseSingleLodgingParams) => {
  const lodgingQuery = useSuspenseQuery(singleLodgingQueryOptions(lodgingId))

  const updateLodgingMutation = useMutation(updateLodgingMutationOptions())

  const deleteLodgingMutation = useMutation(deleteLodgingMutationOptions())

  return {
    lodgingQuery,
    updateLodgingMutation,
    deleteLodgingMutation,
  }
}
