import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'
import {
  CityItineraryDetails,
  CityItineraryDetailsSkeleton,
} from '@/components/itineraries/city-itinerary-details'
import { ItineraryAuthorProfileLink } from '@/components/itineraries/itinerary-author-profile-link'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { useSingleUser } from '@/hooks/use-single-user'
import { authClient } from '@/lib/auth-client'

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
  const { itineraryQuery } = useSingleCityItinerary({ cityItineraryId: cityId })
  const { folderQuery } = useSingleItineraryFolder({
    itineraryFolderId: itineraryQuery.data.folderId,
  })
  const { data: session } = authClient.useSession()
  const { userQuery } = useSingleUser({
    userId: folderQuery.data.authorId,
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

      <div className="flex justify-center">
        <ItineraryAuthorProfileLink
          authorId={folderQuery.data.authorId}
          sessionUserId={session?.user.id}
          username={userQuery.data.username}
        />
      </div>

      <CityItineraryDetails id={cityId} />
    </div>
  )
}
