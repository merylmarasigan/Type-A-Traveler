import { Button } from '@/components/ui/button'
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  singleLocationPhotoQueryOptions,
  singleLocationQueryOptions,
} from '@/services/tripadvisor/query-options'
import { Location } from '@/services/tripadvisor/schema'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Bookmark, Eye } from 'lucide-react'

interface LocationPreviewProps {
  city: string
  location: Location
}

export function LocationPreview({ city, location }: LocationPreviewProps) {
  const { data: details } = useSuspenseQuery(
    singleLocationQueryOptions(city, location.location_id),
  )
  const { data: photo } = useSuspenseQuery(
    singleLocationPhotoQueryOptions(city, location.location_id),
  )

  if (!details) return null

  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0 hover:cursor-pointer">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={photo}
        alt={location.name}
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
      <CardHeader>
        <CardTitle>{details.name}</CardTitle>
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
