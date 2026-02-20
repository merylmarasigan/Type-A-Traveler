import { getActivitiesFn } from '@/services/foursquare/api'
import { queryOptions } from '@tanstack/react-query'

export const activitiesQueryOptions = (city: string, query?: string) =>
  queryOptions({
    queryKey: ['cities', city, 'activities', query],
    queryFn: () => getActivitiesFn({ data: { location: city, query } }),
  })
