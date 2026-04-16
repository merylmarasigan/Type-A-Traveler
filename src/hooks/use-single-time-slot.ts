import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteTimeSlotMutationOptions,
  singleTimeSlotQueryOptions,
  updateTimeSlotMutationOptions,
} from '@/services/backend/time-slots.options'

type UseSingleTimeSlotParams = {
  timeSlotId: string
}

export const useSingleTimeSlot = ({ timeSlotId }: UseSingleTimeSlotParams) => {
  const timeSlotQuery = useSuspenseQuery(singleTimeSlotQueryOptions(timeSlotId))

  const updateTimeSlotMutation = useMutation(updateTimeSlotMutationOptions())

  const deleteTimeSlotMutation = useMutation(deleteTimeSlotMutationOptions())

  return {
    timeSlotQuery,
    updateTimeSlotMutation,
    deleteTimeSlotMutation,
  }
}
