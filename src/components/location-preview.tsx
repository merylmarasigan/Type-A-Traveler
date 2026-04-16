import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'
import type { Location } from '@/services/tripadvisor/schema'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
    <Suspense fallback={<p>Loading...</p>}>
      <LocationPreviewContent {...props} />
    </Suspense>
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
