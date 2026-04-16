import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'
import {
  CityItineraryDetails,
  CityItineraryDetailsSkeleton,
} from '@/components/itineraries/city-itinerary-details'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'

export const Route = createFileRoute('/itineraries/cities/$cityId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { cityId } = Route.useParams()
  return (
    <Suspense
      fallback={
        <div className="flex flex-col h-full gap-2 p-2">
          <Skeleton className="h-9 w-32" />
          <CityItineraryDetailsSkeleton />
        </div>
      }
    >
      <RouteContent cityId={cityId} />
    </Suspense>
  )
}

function RouteContent({ cityId }: { cityId: string }) {
  const { itineraryQuery } = useSingleCityItinerary(cityId)
  const { folderQuery } = useSingleItineraryFolder(itineraryQuery.data.folderId)

  return (
    <div className="flex flex-col h-full gap-2 p-2">
      <Button variant="link" asChild className="self-start">
        <Link
          to="/itineraries/$id"
          params={{ id: itineraryQuery.data.folderId }}
        >
          <ArrowLeft />
          {folderQuery.data.title}
        </Link>
      </Button>

      <CityItineraryDetails id={cityId} />
    </div>
  )
}
