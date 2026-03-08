import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  singleLocationPhotoQueryOptions,
  singleLocationQueryOptions,
} from '@/services/tripadvisor/query-options'
import { Location } from '@/services/tripadvisor/schema'
import { useSuspenseQuery } from '@tanstack/react-query'
import { SaveActivityButton } from '@/components/saved-activities/save-activity-button'
import { authClient } from '@/lib/auth-client'
import { LocationDetailsDialog } from '@/components/location-details'

interface LocationPreviewProps {
  city: string
  location: Location
  cityPhoto: string
}

export function LocationPreview({ city, location, cityPhoto }: LocationPreviewProps) {
  const { data: details } = useSuspenseQuery(
    singleLocationQueryOptions(city, location.location_id),
  )

  const { data: photo } = useSuspenseQuery(
    singleLocationPhotoQueryOptions(city, location.location_id),
  )

  const { data, isPending: authPending } = authClient.useSession()

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
        <LocationDetailsDialog city={city} details={details} imageUrl={photo ? photo : cityPhoto} />
        <SaveActivityButton
          activity={details}
          user={data?.user}
          city={city}
          disabled={authPending || !data?.user}
          imageUrl={photo ? photo : cityPhoto}
        />
      </CardFooter>
    </Card>
  )
}
