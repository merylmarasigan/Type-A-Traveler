import { UpdateUser } from '@/db/types'
import {
  getSingleUserFn,
  updateUserFn,
  deleteUserFn,
  getUsersFn,
} from '@/services/backend/users.api'
import { mutationOptions, queryOptions } from '@tanstack/react-query'

const multipleUsersQueryKey = () => ['users'] as const

const singleUserQueryKey = (userId: string) => ['users', userId] as const

export const multipleUsersQueryOptions = () =>
  queryOptions({
    queryKey: multipleUsersQueryKey(),
    queryFn: () => getUsersFn(),
  })

export const singleUserQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: singleUserQueryKey(userId),
    queryFn: () => getSingleUserFn({ data: { userId } }),
    enabled: userId !== '',
  })

export const updateUserMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateUser'],
    mutationFn: (data: UpdateUser) => updateUserFn({ data }),
    onSuccess: async (data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: singleUserQueryKey(data.id),
      }),
  })

export const deleteUserMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteUser'],
    mutationFn: (userId: string) => deleteUserFn({ data: { userId } }),
    onSuccess: async (_data, _variables, _result, ctx) =>
      await ctx.client.invalidateQueries({
        queryKey: multipleUsersQueryKey(),
      }),
  })
