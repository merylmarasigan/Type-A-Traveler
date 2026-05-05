import { queryOptions } from '@tanstack/react-query'
import type { LocationCategory } from '@/services/tripadvisor'
import { getDefaultLocationFn } from '@/services/tripadvisor/api'
import {
  getLocationsFn,
  getSingleLocationFn,
  getSingleLocationPhotoFn,
} from '@/services/tripadvisor'

export const locationsQueryOptions = ({
  city,
  category,
  lat,
  lng,
}: {
  city: string
  category: LocationCategory
  lat: string
  lng: string
}) =>
  queryOptions({
    queryKey: ['cities', city, 'tripadvisor_locations', category, lat, lng],
    queryFn: () =>
      getLocationsFn({
        data: { location: city, category: category, lat: lat, lng: lng },
      }),
    staleTime: Infinity, // TO PREVENT HITTING API LIMIT
  })

export const defaultLocationQueryOptions = ({
  city,
  lat,
  lng,
}: {
  city: string
  lat: string
  lng: string
}) =>
  queryOptions({
    queryKey: ['cities', city, 'tripadvisor_locations', lat, lng],
    queryFn: () =>
      getDefaultLocationFn({ data: { location: city, lat: lat, lng: lng } }),
    staleTime: Infinity, // TO PREVENT HITTING API LIMIT
  })

export const singleLocationQueryOptions = ({
  city,
  locationId,
}: {
  city: string
  locationId: string
}) =>
  queryOptions({
    queryKey: ['cities', city, 'tripadvisor_locations', locationId],
    queryFn: () => getSingleLocationFn({ data: { locationId } }),
    staleTime: Infinity, // TO PREVENT HITTING API LIMIT
  })

export const singleLocationPhotoQueryOptions = ({
  city,
  locationId,
}: {
  city: string
  locationId: string
}) =>
  queryOptions({
    queryKey: ['cities', city, 'tripadvisor_locations', locationId, 'photo'],
    queryFn: () => getSingleLocationPhotoFn({ data: { locationId } }),
    staleTime: Infinity, // TO PREVENT HITTING API LIMIT
  })
