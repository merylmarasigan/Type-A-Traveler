import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { NewSavedActivity, UpdateSavedActivity } from '@/db/types'
import {
  createSavedActivityFn,
  deleteSavedActivityFn,
  getCityItinerarySavedActivitiesFn,
  getSingleSavedActivityFn,
  getTimeSlotActivitiesFn,
  getTimeSlotActivityFn,
  getUnlinkedActivitiesForTimeSlotFn,
  getUserSavedActivitiesFn,
  linkActivityToTimeSlotFn,
  unlinkActivityFromTimeSlotFn,
  updateSavedActivityFn,
  updateTimeSlotActivityNoteFn,
} from '@/services/backend/saved-activities.api'

const userSavedActivitiesQueryKey = (userId?: string, city?: string) =>
  ['users', userId, 'saved_activities', city] as const

const cityItinerarySavedActivitiesQueryKey = (cityItineraryId?: string) =>
  ['city_itineraries', cityItineraryId, 'saved_activities'] as const

const singleSavedActivityQueryKey = (savedActivityId: string) =>
  ['saved_activities', savedActivityId] as const

const timeSlotActivitiesQueryKey = (timeSlotId: string) =>
  ['time_slots', timeSlotId, 'activities'] as const

const unlinkedActivitiesQueryKey = (
  timeSlotId: string,
  userId: string,
  city: string,
) => ['time_slots', timeSlotId, 'unlinked_activities', userId, city] as const

const timeSlotActivityQueryKey = (
  savedActivityId: string,
  timeSlotId: string,
) => ['time_slot_activities', savedActivityId, timeSlotId] as const

export const userSavedActivitiesQueryOptions = ({
  userId,
  city,
}: {
  userId?: string
  city?: string
}) =>
  queryOptions({
    queryKey: userSavedActivitiesQueryKey(userId, city),
    queryFn: () => getUserSavedActivitiesFn({ data: { userId, city } }),
    enabled: userId !== '',
  })

export const cityItinerarySavedActivitiesQueryOptions = ({
  cityItineraryId,
}: {
  cityItineraryId?: string
}) =>
  queryOptions({
    queryKey: cityItinerarySavedActivitiesQueryKey(cityItineraryId),
    queryFn: () =>
      getCityItinerarySavedActivitiesFn({ data: { cityItineraryId } }),
    enabled: cityItineraryId !== undefined && cityItineraryId !== '',
  })

export const singleSavedActivityQueryOptions = ({
  savedActivityId,
}: {
  savedActivityId: string
}) =>
  queryOptions({
    queryKey: singleSavedActivityQueryKey(savedActivityId),
    queryFn: () => getSingleSavedActivityFn({ data: { savedActivityId } }),
    enabled: savedActivityId !== '',
  })

export const timeSlotActivitiesQueryOptions = ({
  timeSlotId,
}: {
  timeSlotId: string
}) =>
  queryOptions({
    queryKey: timeSlotActivitiesQueryKey(timeSlotId),
    queryFn: () => getTimeSlotActivitiesFn({ data: { timeSlotId } }),
    enabled: timeSlotId !== '',
  })

export const unlinkedActivitiesQueryOptions = ({
  timeSlotId,
  userId,
  city,
}: {
  timeSlotId: string
  userId: string
  city: string
}) =>
  queryOptions({
    queryKey: unlinkedActivitiesQueryKey(timeSlotId, userId, city),
    queryFn: () =>
      getUnlinkedActivitiesForTimeSlotFn({
        data: { timeSlotId, userId, city },
      }),
    enabled: timeSlotId !== '' && userId !== '' && city !== '',
  })

export const createSavedActivityMutationOptions = ({
  cityItineraryId,
}: {
  cityItineraryId?: string
}) =>
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

export const updateSavedActivityMutationOptions = ({
  cityItineraryId,
  userId,
  city,
}: {
  cityItineraryId?: string
  userId?: string
  city?: string
}) =>
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

export const linkActivityToTimeSlotMutationOptions = ({
  timeSlotId,
  cityItineraryId,
  userId,
  city,
}: {
  timeSlotId: string
  cityItineraryId: string
  userId: string
  city: string
}) =>
  mutationOptions({
    mutationKey: ['linkActivityToTimeSlot'],
    mutationFn: (savedActivityId: string) =>
      linkActivityToTimeSlotFn({ data: { savedActivityId, timeSlotId } }),
    onSuccess: async (_data, _variables, _result, ctx) => {
      await ctx.client.invalidateQueries({
        queryKey: timeSlotActivitiesQueryKey(timeSlotId),
      })
      await ctx.client.invalidateQueries({
        queryKey: cityItinerarySavedActivitiesQueryKey(cityItineraryId),
      })
      await ctx.client.invalidateQueries({
        queryKey: unlinkedActivitiesQueryKey(timeSlotId, userId, city),
      })
    },
  })

export const unlinkActivityFromTimeSlotMutationOptions = ({
  timeSlotId,
  cityItineraryId,
  userId,
  city,
}: {
  timeSlotId: string
  cityItineraryId: string
  userId: string
  city: string
}) =>
  mutationOptions({
    mutationKey: ['unlinkActivityFromTimeSlot'],
    mutationFn: (savedActivityId: string) =>
      unlinkActivityFromTimeSlotFn({ data: { savedActivityId, timeSlotId } }),
    onSuccess: async (_data, _variables, _result, ctx) => {
      toast.success(`Removed activity from time slot`)

      await ctx.client.invalidateQueries({
        queryKey: timeSlotActivitiesQueryKey(timeSlotId),
      })
      await ctx.client.invalidateQueries({
        queryKey: cityItinerarySavedActivitiesQueryKey(cityItineraryId),
      })
      await ctx.client.invalidateQueries({
        queryKey: unlinkedActivitiesQueryKey(timeSlotId, userId, city),
      })
    },
  })

export const timeSlotActivityQueryOptions = ({
  savedActivityId,
  timeSlotId,
}: {
  savedActivityId: string
  timeSlotId: string
}) =>
  queryOptions({
    queryKey: timeSlotActivityQueryKey(savedActivityId, timeSlotId),
    queryFn: () =>
      getTimeSlotActivityFn({ data: { savedActivityId, timeSlotId } }),
    enabled: savedActivityId !== '' && timeSlotId !== '',
  })

export const updateTimeSlotActivityNoteMutationOptions = ({
  savedActivityId,
  timeSlotId,
}: {
  savedActivityId: string
  timeSlotId: string
}) =>
  mutationOptions({
    mutationKey: ['updateTimeSlotActivityNote', savedActivityId, timeSlotId],
    mutationFn: ({ id, note }: { id: string; note: string | null }) =>
      updateTimeSlotActivityNoteFn({ data: { id, note } }),
    onSuccess: async (_data, _variables, _result, ctx) => {
      toast.success('Note saved')

      await ctx.client.invalidateQueries({
        queryKey: timeSlotActivityQueryKey(savedActivityId, timeSlotId),
      })
    },
  })
