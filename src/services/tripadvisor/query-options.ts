import {
  getLocationsFn,
  getSingleLocationFn,
  getSingleLocationPhotoFn,
} from '@/services/tripadvisor/api'
import { queryOptions } from '@tanstack/react-query'

export const locationsQueryOptions = (city: string) =>
  queryOptions({
    queryKey: ['cities', city, 'tripadvisor_locations'],
    queryFn: () => getLocationsFn({ data: { location: city } }),
  })

export const singleLocationQueryOptions = (city: string, locationId: string) =>
  queryOptions({
    queryKey: ['cities', city, 'tripadvisor_locations', locationId],
    queryFn: () => getSingleLocationFn({ data: { locationId } }),
  })

export const singleLocationPhotoQueryOptions = (
  city: string,
  locationId: string,
) =>
  queryOptions({
    queryKey: ['cities', city, 'tripadvisor_locations', locationId, 'photo'],
    queryFn: () => getSingleLocationPhotoFn({ data: { locationId } }),
  })
