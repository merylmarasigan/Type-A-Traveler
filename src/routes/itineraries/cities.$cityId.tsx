import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/itineraries/cities/$cityId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { cityId } = Route.useParams()
  const { itineraryQuery } = useSingleCityItinerary(cityId)

  return <div>{itineraryQuery.data.title}</div>
}
