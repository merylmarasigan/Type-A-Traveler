import { mutationOptions, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { UpdateUser } from '@/db/types'
import {
  deleteUserFn,
  getSingleUserFn,
  getUsersFn,
  updateUserFn,
} from '@/services/backend/users.api'

const multipleUsersQueryKey = () => ['users'] as const

const singleUserQueryKey = (userId: string) => ['users', userId] as const

export const multipleUsersQueryOptions = () =>
  queryOptions({
    queryKey: multipleUsersQueryKey(),
    queryFn: () => getUsersFn(),
  })

export const singleUserQueryOptions = ({ userId }: { userId: string }) =>
  queryOptions({
    queryKey: singleUserQueryKey(userId),
    queryFn: () => getSingleUserFn({ data: { userId } }),
    enabled: userId !== '',
  })

export const updateUserMutationOptions = () =>
  mutationOptions({
    mutationKey: ['updateUser'],
    mutationFn: (data: UpdateUser) => updateUserFn({ data }),
    onSuccess: async (data, variables, _result, ctx) => {
      if (variables.showSavedActivitiesOnProfile !== undefined) {
        toast.success(
          `${variables.showSavedActivitiesOnProfile ? 'Showing' : 'Hiding'} saved activities on profile`,
        )
      } else {
        toast.success(`Updated ${data.name}`)
      }

      await ctx.client.invalidateQueries({
        queryKey: singleUserQueryKey(data.id),
      })
    },
  })

export const deleteUserMutationOptions = () =>
  mutationOptions({
    mutationKey: ['deleteUser'],
    mutationFn: (userId: string) => deleteUserFn({ data: { userId } }),
    onSuccess: async (_data, _variables, _result, ctx) => {
      toast.success('Deleted user')

      await ctx.client.invalidateQueries({
        queryKey: multipleUsersQueryKey(),
      })
    },
  })
