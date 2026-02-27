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

export const createTimeSlotMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createTimeSlot'],
    mutationFn: (data: NewTimeSlot) => createTimeSlotFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_days', data.itineraryDayId, 'time_slots'],
      }),
  })

export const updateTimeSlotMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateTimeSlot'],
    mutationFn: (data: UpdateTimeSlot) => updateTimeSlotFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['time_slots', data.id],
      }),
  })

export const deleteTimeSlotMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteTimeSlot'],
    mutationFn: (timeSlotId: string) =>
      deleteTimeSlotFn({ data: { timeSlotId } }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['itinerary_days', data.itineraryDayId, 'time_slots'],
      }),
  })
