import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteUserMutationOptions,
  singleUserQueryOptions,
  updateUserMutationOptions,
} from '@/services/backend/users.options'

type UseSingleUserParams = {
  userId: string
}

export const useSingleUser = ({ userId }: UseSingleUserParams) => {
  const userQuery = useSuspenseQuery(singleUserQueryOptions({ userId }))

  const updateUserMutation = useMutation(updateUserMutationOptions())

  const deleteUserMutation = useMutation(deleteUserMutationOptions())

  return {
    userQuery,
    updateUserMutation,
    deleteUserMutation,
  }
}
