import {
  deleteTimeSlotMutationOptions,
  singleTimeSlotQueryOptions,
  updateTimeSlotMutationOptions,
} from '@/services/backend/time-slots.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useSingleTimeSlot = (timeSlotId: string) => {
  const timeSlotQuery = useSuspenseQuery(singleTimeSlotQueryOptions(timeSlotId))

  const updateTimeSlotMutation = useMutation(updateTimeSlotMutationOptions())

  const deleteTimeSlotMutation = useMutation(deleteTimeSlotMutationOptions())

  return {
    timeSlotQuery,
    updateTimeSlotMutation,
    deleteTimeSlotMutation,
  }
}
