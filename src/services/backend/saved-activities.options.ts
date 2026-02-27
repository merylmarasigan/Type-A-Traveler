import { NewSavedActivity, UpdateSavedActivity } from '@/db/types'
import {
  createSavedActivityFn,
  getSingleSavedActivityFn,
  getUserSavedActivitiesFn,
  updateSavedActivityFn,
  deleteSavedActivityFn,
} from '@/services/backend/saved-activities.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

const multipleSavedActivitiesQueryKey = (userId: string) =>
  ['users', userId, 'saved_activities'] as const

const singleSavedActivityQueryKey = (savedActivityId: string) =>
  ['saved_activities', savedActivityId] as const

export const userSavedActivitiesQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: multipleSavedActivitiesQueryKey(userId),
    queryFn: () => getUserSavedActivitiesFn({ data: { userId } }),
    enabled: userId !== '',
  })

export const singleSavedActivityQueryOptions = (savedActivityId: string) =>
  queryOptions({
    queryKey: singleSavedActivityQueryKey(savedActivityId),
    queryFn: () => getSingleSavedActivityFn({ data: { savedActivityId } }),
    enabled: savedActivityId !== '',
  })

export const createSavedActivityMutationOptions = (data: NewSavedActivity) =>
  mutationOptions({
    mutationFn: () => createSavedActivityFn({ data }),
    mutationKey: ['createSavedActivity'],
    onSuccess: async (_data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleSavedActivitiesQueryKey(data.userId),
      }),
  })

export const updateSavedActivityMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: UpdateSavedActivity) => updateSavedActivityFn({ data }),
    mutationKey: ['updateSavedActivity'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: singleSavedActivityQueryKey(data.id),
      }),
  })

export const deleteSavedActivityMutationOptions = () =>
  mutationOptions({
    mutationFn: (savedActivityId: string) =>
      deleteSavedActivityFn({ data: { savedActivityId } }),
    mutationKey: ['deleteSavedActivity'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleSavedActivitiesQueryKey(data.userId),
      }),
  })
