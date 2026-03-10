import { CityItineraryPreview } from '@/components/itineraries/city-itinerary-preview'
import { UserSavedActivities } from '@/components/saved-activities/user-saved-activities'
import { TypographyH1 } from '@/components/ui/typography'
import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { authClient } from '@/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/itineraries/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { folderQuery } = useSingleItineraryFolder(id)
  const { itinerariesQuery } = useCityItineraries(id)
  const { data } = authClient.useSession()

  // TODO: add view for only one city in the folder

  return (
    <div>
      <TypographyH1>
        {folderQuery.data.title ?? itinerariesQuery.data[0].title}
      </TypographyH1>
      {itinerariesQuery.data.map((cityItinerary) => (
        <CityItineraryPreview
          key={cityItinerary.id}
          cityItinerary={cityItinerary}
        />
      ))}
      {data?.user && (
        <UserSavedActivities
          user={data.user}
          city={itinerariesQuery.data[0].city}
        />
      )}
    </div>
  )
}
