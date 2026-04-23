import { useSuspenseQuery } from '@tanstack/react-query'
import { multipleUsersQueryOptions } from '@/services/backend/users.options'

export function useUsers() {
  const usersQuery = useSuspenseQuery(multipleUsersQueryOptions())

  return {
    usersQuery,
  }
}
