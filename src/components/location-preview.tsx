import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import type { Location } from '@/services/tripadvisor/schema'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  singleLocationPhotoQueryOptions,
  singleLocationQueryOptions,
} from '@/services/tripadvisor/query-options'
import { SaveActivityButton } from '@/components/saved-activities/save-activity-button'
import { LocationDetailsDialog } from '@/components/location-details'

interface LocationPreviewProps {
  city: string
  lat: string
  lng: string
  location: Location
  cityPhoto: string
}

export function LocationPreview(props: LocationPreviewProps) {
  return (
    <Suspense fallback={<LocationPreviewSkeleton />}>
      <LocationPreviewContent {...props} />
    </Suspense>
  )
}

export function LocationPreviewSkeleton() {
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <Skeleton className="aspect-video w-full rounded-t-md rounded-b-none" />
      <CardHeader>
        <Skeleton className="h-5 w-3/4" />
      </CardHeader>
      <CardFooter className="gap-2 justify-between">
        <Skeleton className="h-9 flex-1" />
        <Skeleton className="h-9 flex-1" />
      </CardFooter>
    </Card>
  )
}

function LocationPreviewContent({
  city,
  lat,
  lng,
  location,
  cityPhoto,
}: LocationPreviewProps) {
  const { data: details } = useSuspenseQuery(
    singleLocationQueryOptions(city, location.location_id),
  )

  const { data: photo } = useSuspenseQuery(
    singleLocationPhotoQueryOptions(city, location.location_id),
  )

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <img
        src={photo ? photo : cityPhoto}
        alt={location.name}
        className="relative aspect-video w-full object-cover dark:brightness-40 rounded-t-md"
      />
      <CardHeader>
        <CardTitle>{location.name}</CardTitle>
      </CardHeader>
      <CardFooter className="gap-2 justify-between">
        <LocationDetailsDialog
          city={city}
          lat={lat}
          lng={lng}
          details={details}
          imageUrl={photo ? photo : cityPhoto}
        />
        <SaveActivityButton
          activity={details}
          city={city}
          lat={lat}
          lng={lng}
          imageUrl={photo ? photo : cityPhoto}
        />
      </CardFooter>
    </Card>
  )
}
