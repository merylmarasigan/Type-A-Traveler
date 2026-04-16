import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  createTimeSlotMutationOptions,
  itineraryDayTimeSlotsQueryOptions,
  updateTimeSlotMutationOptions,
} from '@/services/backend/time-slots.options'

type UseTimeSlotsParams = {
  itineraryDayId: string
}

export const useTimeSlots = ({ itineraryDayId }: UseTimeSlotsParams) => {
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
