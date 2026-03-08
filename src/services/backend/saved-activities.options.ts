import { NewSavedActivity, UpdateSavedActivity } from '@/db/types'
import {
  createSavedActivityFn,
  getSingleSavedActivityFn,
  getUserSavedActivitiesFn,
  updateSavedActivityFn,
  deleteSavedActivityFn,
} from '@/services/backend/saved-activities.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

const multipleSavedActivitiesQueryKey = (userId: string, city?: string) =>
  ['users', userId, 'saved_activities', city] as const

const singleSavedActivityQueryKey = (savedActivityId: string) =>
  ['saved_activities', savedActivityId] as const

export const userSavedActivitiesQueryOptions = (
  userId: string,
  city?: string,
) =>
  queryOptions({
    queryKey: multipleSavedActivitiesQueryKey(userId),
    queryFn: () => getUserSavedActivitiesFn({ data: { userId, city } }),
    enabled: userId !== '',
  })

export const singleSavedActivityQueryOptions = (savedActivityId: string) =>
  queryOptions({
    queryKey: singleSavedActivityQueryKey(savedActivityId),
    queryFn: () => getSingleSavedActivityFn({ data: { savedActivityId } }),
    enabled: savedActivityId !== '',
  })

export const createSavedActivityMutationOptions = () =>
  mutationOptions({
    mutationKey: ['createSavedActivity'],
    mutationFn: (data: NewSavedActivity) => createSavedActivityFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleSavedActivitiesQueryKey(data.userId),
      }),
  })

export const updateSavedActivityMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateSavedActivity'],
    mutationFn: (data: UpdateSavedActivity) => updateSavedActivityFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: singleSavedActivityQueryKey(data.id),
      }),
  })

export const deleteSavedActivityMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteSavedActivity'],
    mutationFn: (savedActivityId: string) =>
      deleteSavedActivityFn({ data: { savedActivityId } }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleSavedActivitiesQueryKey(data.userId),
      }),
  })
