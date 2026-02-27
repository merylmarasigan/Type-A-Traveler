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

export const createItineraryDayMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createItineraryDay'],
    mutationFn: (data: NewItineraryDay) => createItineraryDayFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleItineraryDaysQueryKey(data.cityItineraryId),
      }),
  })

export const updateItineraryDayMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateItineraryDay'],
    mutationFn: (data: UpdateItineraryDay) => updateItineraryDayFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: singleItineraryDayQueryKey(data.id),
      }),
  })

export const deleteItineraryDayMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteItineraryDay'],
    mutationFn: (itineraryDayId: string) =>
      deleteItineraryDayFn({ data: { itineraryDayId } }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleItineraryDaysQueryKey(data.cityItineraryId),
      }),
  })
