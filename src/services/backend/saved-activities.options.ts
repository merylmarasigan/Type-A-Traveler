import { NewSavedActivity, UpdateSavedActivity } from '@/db/types'
import {
  createSavedActivityFn,
  getSingleSavedActivityFn,
  getUserSavedActivitiesFn,
  updateSavedActivityFn,
  deleteSavedActivityFn,
} from '@/services/backend/saved-activities.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

export const userSavedActivitiesQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['users', userId, 'saved_activities'],
    queryFn: () => getUserSavedActivitiesFn({ data: { userId } }),
    enabled: userId !== '',
  })

export const singleSavedActivityQueryOptions = (savedActivityId: string) =>
  queryOptions({
    queryKey: ['saved_activities', savedActivityId],
    queryFn: () => getSingleSavedActivityFn({ data: { savedActivityId } }),
    enabled: savedActivityId !== '',
  })

export const createSavedActivityMutationOptions = (data: NewSavedActivity) =>
  mutationOptions({
    mutationFn: () => createSavedActivityFn({ data }),
    mutationKey: ['createSavedActivity'],
    onSuccess: async (_data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['saved_activities'],
      }),
  })

export const updateSavedActivityMutationOptions = () =>
  mutationOptions({
    mutationFn: (data: UpdateSavedActivity) => updateSavedActivityFn({ data }),
    mutationKey: ['updateSavedActivity'],
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['saved_activities', data.id],
      }),
  })

export const deleteSavedActivityMutationOptions = () =>
  mutationOptions({
    mutationFn: (savedActivityId: string) =>
      deleteSavedActivityFn({ data: { savedActivityId } }),
    mutationKey: ['deleteSavedActivity'],
    onSuccess: async (_data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: ['saved_activities'],
      }),
  })
