import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteUserMutationOptions,
  singleUserQueryOptions,
  updateUserMutationOptions,
} from '@/services/backend/users.options'

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
