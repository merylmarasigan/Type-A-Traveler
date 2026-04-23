import { queryOptions } from '@tanstack/react-query'
import { getCitiesFn } from '@/services/cities/api'

export const citiesQueryOptions = ({
  city,
}: {
  city: string
}) =>
  queryOptions({
    queryKey: ['cities', city],
    queryFn: () => getCitiesFn({ data: { city } }),
    enabled: city !== '',
  })
