import { multipleUsersQueryOptions } from '@/services/backend/users.options'
import { useSuspenseQuery } from '@tanstack/react-query'

export function useUsers() {
  const usersQuery = useSuspenseQuery(multipleUsersQueryOptions())

  return {
    usersQuery,
  }
}
