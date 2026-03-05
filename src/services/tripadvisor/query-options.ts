import {
  LocationCategory,
  getLocationsFn,
  getSingleLocationFn,
  getSingleLocationPhotoFn,
} from '@/services/tripadvisor'
import { queryOptions } from '@tanstack/react-query'

export const locationsQueryOptions = (
  city: string,
  category: LocationCategory,
) =>
  queryOptions({
    queryKey: ['cities', city, 'tripadvisor_locations', category],
    queryFn: () =>
      getLocationsFn({ data: { location: city, category: category } }),
    staleTime: Infinity, // TO PREVENT HITTING API LIMIT
  })

export const singleLocationQueryOptions = (city: string, locationId: string) =>
  queryOptions({
    queryKey: ['cities', city, 'tripadvisor_locations', locationId],
    queryFn: () => getSingleLocationFn({ data: { locationId } }),
    staleTime: Infinity, // TO PREVENT HITTING API LIMIT
  })

export const singleLocationPhotoQueryOptions = (
  city: string,
  locationId: string,
) =>
  queryOptions({
    queryKey: ['cities', city, 'tripadvisor_locations', locationId, 'photo'],
    queryFn: () => getSingleLocationPhotoFn({ data: { locationId } }),
    staleTime: Infinity, // TO PREVENT HITTING API LIMIT
  })
