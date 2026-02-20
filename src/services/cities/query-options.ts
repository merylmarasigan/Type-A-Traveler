import { getCitiesFn } from '@/services/cities/api'
import { queryOptions } from '@tanstack/react-query'

export const citiesQueryOptions = (city: string) =>
  queryOptions({
    queryKey: ['cities'],
    queryFn: () => getCitiesFn({ data: { city } }),
  })
