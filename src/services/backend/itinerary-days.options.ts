import { NewItineraryDay, UpdateItineraryDay } from '@/db/types'
import {
  getCityItineraryDaysFn,
  getSingleItineraryDayFn,
  createItineraryDayFn,
  updateItineraryDayFn,
  deleteItineraryDayFn,
} from '@/services/backend/itinerary-days.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

const multipleItineraryDaysQueryKey = (cityItineraryId: string) =>
  ['city_itineraries', cityItineraryId, 'itinerary_days'] as const

const singleItineraryDayQueryKey = (itineraryDayId: string) =>
  ['itinerary_days', itineraryDayId] as const

export const cityItineraryDaysQueryOptions = (cityItineraryId: string) =>
  queryOptions({
    queryKey: multipleItineraryDaysQueryKey(cityItineraryId),
    queryFn: () => getCityItineraryDaysFn({ data: { cityItineraryId } }),
    enabled: cityItineraryId !== '',
  })

export const singleItineraryDayQueryOptions = (itineraryDayId: string) =>
  queryOptions({
    queryKey: singleItineraryDayQueryKey(itineraryDayId),
    queryFn: () => getSingleItineraryDayFn({ data: { itineraryDayId } }),
    enabled: itineraryDayId !== '',
  })

export const createItineraryDayMutationOptions = (data: NewItineraryDay) =>
  mutationOptions({
    mutationFn: () => createItineraryDayFn({ data }),
    mutationKey: ['createItineraryDay'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleItineraryDaysQueryKey(data.cityItineraryId),
      }),
  })

export const updateItineraryDayMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: UpdateItineraryDay) => updateItineraryDayFn({ data }),
    mutationKey: ['updateItineraryDay'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: singleItineraryDayQueryKey(data.id),
      }),
  })

export const deleteItineraryDayMutationOptions = () =>
  mutationOptions({
    mutationFn: (itineraryDayId: string) =>
      deleteItineraryDayFn({ data: { itineraryDayId } }),
    mutationKey: ['deleteItineraryDay'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleItineraryDaysQueryKey(data.cityItineraryId),
      }),
  })
