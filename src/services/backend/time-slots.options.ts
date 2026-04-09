import { NewTimeSlot, UpdateTimeSlot } from '@/db/types'
import {
  getItineraryDayTimeSlotsFn,
  getSingleTimeSlotFn,
  createTimeSlotFn,
  updateTimeSlotFn,
  deleteTimeSlotFn,
} from '@/services/backend/time-slots.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { formatDate } from 'date-fns'
import { toast } from 'sonner'

const multipleTimeSlotsQueryKey = (itineraryDayId: string) =>
  ['itinerary_days', itineraryDayId, 'time_slots'] as const

const singleTimeSlotQueryKey = (timeSlotId: string) =>
  ['time_slots', timeSlotId] as const

export const itineraryDayTimeSlotsQueryOptions = (itineraryDayId: string) =>
  queryOptions({
    queryKey: multipleTimeSlotsQueryKey(itineraryDayId),
    queryFn: () => getItineraryDayTimeSlotsFn({ data: { itineraryDayId } }),
    enabled: itineraryDayId !== '',
  })

export const singleTimeSlotQueryOptions = (timeSlotId: string) =>
  queryOptions({
    queryKey: singleTimeSlotQueryKey(timeSlotId),
    queryFn: () => getSingleTimeSlotFn({ data: { timeSlotId } }),
    enabled: timeSlotId !== '',
  })

export const createTimeSlotMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createTimeSlot'],
    mutationFn: (data: NewTimeSlot) => createTimeSlotFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Added new time slot${getWeekDay(data.startTime)}`)

      await ctx.client.invalidateQueries({
        queryKey: multipleTimeSlotsQueryKey(data.itineraryDayId),
      })
    },
  })

export const updateTimeSlotMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateTimeSlot'],
    mutationFn: (data: UpdateTimeSlot) => updateTimeSlotFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Updated time slot${getWeekDay(data.startTime)}`)

      await ctx.client.invalidateQueries({
        queryKey: singleTimeSlotQueryKey(data.id),
      })
    },
  })

export const deleteTimeSlotMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteTimeSlot'],
    mutationFn: (timeSlotId: string) =>
      deleteTimeSlotFn({ data: { timeSlotId } }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Deleted time slot${getWeekDay(data.startTime)}`)

      await ctx.client.invalidateQueries({
        queryKey: multipleTimeSlotsQueryKey(data.itineraryDayId),
      })
    },
  })

const getWeekDay = (date: Date | null) =>
  date ? ` for ${formatDate(date, 'cccc')}` : ''
