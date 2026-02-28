import {
  deleteUserMutationOptions,
  singleUserQueryOptions,
  updateUserMutationOptions,
} from '@/services/backend/users.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useSingleUser = (userId: string) => {
  const userQuery = useSuspenseQuery(singleUserQueryOptions(userId))

  const updateUserMutation = useMutation(updateUserMutationOptions())

  const deleteUserMutation = useMutation(deleteUserMutationOptions())

  return {
    userQuery,
    updateUserMutation,
    deleteUserMutation,
  }
}
