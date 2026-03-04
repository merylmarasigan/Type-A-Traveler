import { LocationPreview } from '@/components/location-preview'
import { ErrorComponent } from '@/components/error'
import { TypographyH1, TypographyH4 } from '@/components/ui/typography'
import { locationsQueryOptions } from '@/services/tripadvisor/query-options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { capitalizeFirstLetter } from 'better-auth'



export const Route = createFileRoute('/itineraries/new/$city')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    category: (search.category as string) || undefined,
  }),
  errorComponent: (error) => (
    <ErrorComponent
      {...error}
      description="No activities found for this city."
    />
  ),
})

function RouteComponent() {
  const { city } = Route.useParams()
  const match = Route.useMatch()
  var category = match.search?.category as string | undefined  

  if(category !== "hotels" && category !== "attractions" && category !== "restaurants")
  {
    category = "hotels"
  }

  const cityLocationsQuery = useSuspenseQuery(locationsQueryOptions(city, category))

  return (
    <div className="flex flex-col">
      <TypographyH1>Create an itinerary for {city}</TypographyH1>
      <div className="flex">
        <ul className="flex flex-col gap-2 items-center w-lg max-w-md">
          <TypographyH4 style={{textTransform: 'capitalize'}}>Suggested {category}</TypographyH4>
          {cityLocationsQuery.data.map((location) => (
            <LocationPreview
              key={location.location_id}
              city={city}
              location={location}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
