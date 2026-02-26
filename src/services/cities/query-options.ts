import { getCitiesFn } from '@/services/cities/api'
import { queryOptions } from '@tanstack/react-query'

export const citiesQueryOptions = (city: string) =>
  queryOptions({
    queryKey: ['cities', city],
    queryFn: () => getCitiesFn({ data: { city } }),
    enabled: city !== '',
  })
