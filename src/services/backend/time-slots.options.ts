import { NewTimeSlot, UpdateTimeSlot } from '@/db/types'
import {
  getItineraryDayTimeSlotsFn,
  getSingleTimeSlotFn,
  createTimeSlotFn,
  updateTimeSlotFn,
  deleteTimeSlotFn,
} from '@/services/backend/time-slots.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

export const itineraryDayTimeSlotsQueryOptions = (itineraryDayId: string) =>
  queryOptions({
    queryKey: ['itinerary_days', itineraryDayId, 'time_slots'],
    queryFn: () => getItineraryDayTimeSlotsFn({ data: { itineraryDayId } }),
    enabled: itineraryDayId !== '',
  })

export const singleTimeSlotQueryOptions = (timeSlotId: string) =>
  queryOptions({
    queryKey: ['time_slots', timeSlotId],
    queryFn: () => getSingleTimeSlotFn({ data: { timeSlotId } }),
    enabled: timeSlotId !== '',
  })

export const createTimeSlotMutationOptions = (data: NewTimeSlot) =>
  mutationOptions({
    mutationFn: () => createTimeSlotFn({ data }),
    mutationKey: ['createTimeSlot'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_days', data.itineraryDayId, 'time_slots'],
      }),
  })

export const updateTimeSlotMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: UpdateTimeSlot) => updateTimeSlotFn({ data }),
    mutationKey: ['updateTimeSlot'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['time_slots', data.id],
      }),
  })

export const deleteTimeSlotMutationOptions = () =>
  mutationOptions({
    mutationFn: (timeSlotId: string) =>
      deleteTimeSlotFn({ data: { timeSlotId } }),
    mutationKey: ['deleteTimeSlot'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_days', data.itineraryDayId, 'time_slots'],
      }),
  })
