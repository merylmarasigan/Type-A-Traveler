import { NewItineraryDay, UpdateItineraryDay } from '@/db/types'
import {
  getCityItineraryDaysFn,
  getSingleItineraryDayFn,
  createItineraryDaysFn,
  updateSingleItineraryDayFn,
  deleteItineraryDayFn,
  updateMultipleItineraryDaysFn,
} from '@/services/backend/itinerary-days.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'

const multipleItineraryDaysQueryKey = (cityItineraryId?: string) =>
  ['city_itineraries', cityItineraryId, 'itinerary_days'] as const

const singleItineraryDayQueryKey = (itineraryDayId: string) =>
  ['itinerary_days', itineraryDayId] as const

export const cityItineraryDaysQueryOptions = (cityItineraryId?: string) =>
  queryOptions({
    queryKey: multipleItineraryDaysQueryKey(cityItineraryId),
    queryFn: () => getCityItineraryDaysFn({ data: { cityItineraryId } }),
    enabled: cityItineraryId !== undefined && cityItineraryId !== '',
  })

export const singleItineraryDayQueryOptions = (itineraryDayId: string) =>
  queryOptions({
    queryKey: singleItineraryDayQueryKey(itineraryDayId),
    queryFn: () => getSingleItineraryDayFn({ data: { itineraryDayId } }),
    enabled: itineraryDayId !== '',
  })

export const createItineraryDaysMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createItineraryDays'],
    mutationFn: (data: NewItineraryDay[]) => createItineraryDaysFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`New date added to itinerary!`)

      await ctx.client.invalidateQueries({
        queryKey: multipleItineraryDaysQueryKey(data[0].cityItineraryId),
      })
    },
  })

export const updateSingleItineraryDayMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateSingleItineraryDay'],
    mutationFn: (data: UpdateItineraryDay) =>
      updateSingleItineraryDayFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success('Updated itinerary date')

      await ctx.client.invalidateQueries({
        queryKey: singleItineraryDayQueryKey(data.id),
      })
    },
  })

export const updateMultipleItineraryDaysMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateMultipleItineraryDays'],
    mutationFn: (data: NewItineraryDay[]) =>
      updateMultipleItineraryDaysFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success('Updated itinerary schedule')

      await ctx.client.invalidateQueries({
        queryKey: multipleItineraryDaysQueryKey(data[0].cityItineraryId),
      })
    },
  })

export const deleteItineraryDayMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteItineraryDay'],
    mutationFn: (itineraryDayId: string) =>
      deleteItineraryDayFn({ data: { itineraryDayId } }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success('Deleted date from schedule')

      await ctx.client.invalidateQueries({
        queryKey: multipleItineraryDaysQueryKey(data.cityItineraryId),
      })
    },
  })
