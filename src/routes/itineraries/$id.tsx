import { ItineraryDaysList } from '@/components/itinerary-days'
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
  const { itinerariesQuery } = useCityItineraries(id)

  return (
    <div>
      <TypographyH1>
        {folderQuery.data.title ?? itinerariesQuery.data[0].title}
      </TypographyH1>
      {itinerariesQuery.data.map((cityItinerary) => (
        //   TODO: Create a CityItineraryPreview component
        <div key={cityItinerary.id}>
          <TypographyH2>{cityItinerary.title}</TypographyH2>
          <ItineraryDaysList cityItineraryId={cityItinerary.id} />
        </div>
      ))}
    </div>
  )
}
