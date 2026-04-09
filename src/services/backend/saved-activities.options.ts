import { NewSavedActivity, UpdateSavedActivity } from '@/db/types'
import {
  createSavedActivityFn,
  getSingleSavedActivityFn,
  getUserSavedActivitiesFn,
  updateSavedActivityFn,
  deleteSavedActivityFn,
  getCityItinerarySavedActivitiesFn,
} from '@/services/backend/saved-activities.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'

const userSavedActivitiesQueryKey = (userId?: string, city?: string) =>
  ['users', userId, 'saved_activities', city] as const

const cityItinerarySavedActivitiesQueryKey = (cityItineraryId?: string) =>
  ['city_itineraries', cityItineraryId, 'saved_activities'] as const

const singleSavedActivityQueryKey = (savedActivityId: string) =>
  ['saved_activities', savedActivityId] as const

export const userSavedActivitiesQueryOptions = (
  userId?: string,
  city?: string,
) =>
  queryOptions({
    queryKey: userSavedActivitiesQueryKey(userId, city),
    queryFn: () => getUserSavedActivitiesFn({ data: { userId, city } }),
    enabled: userId !== '',
  })

export const cityItinerarySavedActivitiesQueryOptions = (
  cityItineraryId?: string,
) =>
  queryOptions({
    queryKey: cityItinerarySavedActivitiesQueryKey(cityItineraryId),
    queryFn: () =>
      getCityItinerarySavedActivitiesFn({ data: { cityItineraryId } }),
    enabled: cityItineraryId !== undefined && cityItineraryId !== '',
  })

export const singleSavedActivityQueryOptions = (savedActivityId: string) =>
  queryOptions({
    queryKey: singleSavedActivityQueryKey(savedActivityId),
    queryFn: () => getSingleSavedActivityFn({ data: { savedActivityId } }),
    enabled: savedActivityId !== '',
  })

export const createSavedActivityMutationOptions = (cityItineraryId?: string) =>
  mutationOptions({
    mutationKey: ['createSavedActivity'],
    mutationFn: (data: NewSavedActivity) => createSavedActivityFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      if (cityItineraryId) {
        toast.success(`Added ${data.name} to your itinerary`)

        await ctx.client.invalidateQueries({
          queryKey: cityItinerarySavedActivitiesQueryKey(cityItineraryId),
        })
      } else {
        toast.success(`Saved ${data.name} to your bookmarks`)

        await ctx.client.invalidateQueries({
          queryKey: userSavedActivitiesQueryKey(data.userId, data.city),
        })
      }
    },
  })

export const updateSavedActivityMutationOptions = (
  cityItineraryId?: string,
  userId?: string,
  city?: string,
) =>
  mutationOptions({
    mutationKey: ['updateSavedActivity'],
    mutationFn: (data: UpdateSavedActivity) => updateSavedActivityFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Updated details for ${data.name}`)

      await ctx.client.invalidateQueries({
        queryKey: singleSavedActivityQueryKey(data.id),
      })
      await ctx.client.invalidateQueries({
        queryKey: cityItinerarySavedActivitiesQueryKey(cityItineraryId),
      })
      await ctx.client.invalidateQueries({
        queryKey: userSavedActivitiesQueryKey(userId, city),
      })
    },
  })

export const deleteSavedActivityMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteSavedActivity'],
    mutationFn: (savedActivityId: string) =>
      deleteSavedActivityFn({ data: { savedActivityId } }),
    onSuccess: async (data, _variables, _result, ctx) => {
      toast.success(`Deleted ${data.name}`)

      await ctx.client.invalidateQueries({
        queryKey: userSavedActivitiesQueryKey(data.userId),
      })
    },
  })
