import { CityItineraryPreview } from '@/components/itineraries/city-itinerary-preview'
import { UserSavedActivities } from '@/components/saved-activities/user-saved-activities'
import { TypographyH1, TypographyH2 } from '@/components/ui/typography'
import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/itineraries/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { folderQuery } = useSingleItineraryFolder(id)
  const { itinerariesQuery: cityItineraries } = useCityItineraries(id)

  // TODO: add view for only one city in the folder

  return (
    <div className="flex flex-col gap-2 p-2">
      <TypographyH1>
        {folderQuery.data.title ?? cityItineraries.data[0].title}
      </TypographyH1>
      {cityItineraries.data.length > 1 && (
        <TypographyH2 className="text-center">
          {cityItineraries.data.length} cities
        </TypographyH2>
      )}
      {cityItineraries.data.map((cityItinerary) => (
        <CityItineraryPreview
          key={cityItinerary.id}
          cityItinerary={cityItinerary}
        />
      ))}
      <UserSavedActivities city={cityItineraries.data[0].city} />
    </div>
  )
}
