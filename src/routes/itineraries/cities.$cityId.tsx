import { CityItineraryDetails } from '@/components/itineraries/city-itinerary-details'
import { Button } from '@/components/ui/button'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/itineraries/cities/$cityId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { cityId } = Route.useParams()
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
