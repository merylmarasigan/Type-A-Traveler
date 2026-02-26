import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useItineraryFolder } from '@/hooks/use-itinerary-folder'
import { singleLocationPhotoQueryOptions } from '@/services/tripadvisor/query-options'
import { Location } from '@/services/tripadvisor/schema'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Bookmark, Eye } from 'lucide-react'

interface LocationPreviewProps {
  city: string
  location: Location
}

export function LocationPreview({ city, location }: LocationPreviewProps) {
  // const { data: details } = useSuspenseQuery(
  //   singleLocationQueryOptions(city, location.location_id),
  // )

  const { data: photo } = useSuspenseQuery(
    singleLocationPhotoQueryOptions(city, location.location_id),
  )

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 hover:cursor-pointer">
      <img
        src={photo}
        alt={location.name}
        className="relative aspect-video w-full object-cover   dark:brightness-40 rounded-t-md"
      />
      <CardHeader>
        <CardTitle>{location.name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">
          <Eye />
          View
        </Button>
        <Button className="w-full" variant="secondary">
          <Bookmark />
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}
