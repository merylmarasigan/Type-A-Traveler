import { Link, createFileRoute, notFound } from '@tanstack/react-router'
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
import { getSingleCityItineraryFn } from '@/services/backend/city-itineraries.api'
import { getSingleItineraryFolderFn } from '@/services/backend/itinerary-folders.api'
import { getSession } from '@/services/backend/auth.functions'
import { NotFound } from '@/components/util/not-found'

export const Route = createFileRoute('/itineraries/cities/$cityId')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const session = await getSession()

    const city = await getSingleCityItineraryFn({
      data: { cityItineraryId: params.cityId },
    })
    const { authorId, isPublic } = await getSingleItineraryFolderFn({
      data: { itineraryFolderId: city.folderId },
    })
    if (!isPublic && session?.user.id !== authorId) throw notFound()
  },
  notFoundComponent: () => <NotFound type="private-itinerary" />,
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
  const { itineraryQuery } = useSingleCityItinerary({ cityItineraryId: cityId })
  const { folderQuery } = useSingleItineraryFolder({
    itineraryFolderId: itineraryQuery.data.folderId,
  })

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
