import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  createTimeSlotMutationOptions,
  itineraryDayTimeSlotsQueryOptions,
  updateTimeSlotMutationOptions,
} from '@/services/backend/time-slots.options'

export const useTimeSlots = (itineraryDayId: string) => {
  const timeSlotsQuery = useSuspenseQuery(
    itineraryDayTimeSlotsQueryOptions(itineraryDayId),
  )

  const createTimeSlotMutation = useMutation(createTimeSlotMutationOptions())

  const updateTimeSlotMutation = useMutation(updateTimeSlotMutationOptions())

  return {
    timeSlotsQuery,
    createTimeSlotMutation,
    updateTimeSlotMutation,
  }
}
