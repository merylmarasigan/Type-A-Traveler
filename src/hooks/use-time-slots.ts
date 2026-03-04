import {
  createTimeSlotMutationOptions,
  itineraryDayTimeSlotsQueryOptions,
} from '@/services/backend/time-slots.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useTimeSlots = (itineraryDayId: string) => {
  const timeSlotsQuery = useSuspenseQuery(
    itineraryDayTimeSlotsQueryOptions(itineraryDayId),
  )

  const createTimeSlotMutation = useMutation(createTimeSlotMutationOptions())

  return {
    timeSlotsQuery,
    createTimeSlotMutation,
  }
}
