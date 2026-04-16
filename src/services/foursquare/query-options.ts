import { queryOptions } from '@tanstack/react-query'
import { getPlacesFn } from '@/services/foursquare/api'

export const placesQueryOptions = (city: string, query?: string) =>
  queryOptions({
    queryKey: ['cities', city, 'foursquare_places', query],
    queryFn: () => getPlacesFn({ data: { location: city, query } }),
  })
