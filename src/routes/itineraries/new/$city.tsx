import { LocationPreview } from '@/components/location-preview'
import { ErrorComponent } from '@/components/error'
import { TypographyH1, TypographyH4 } from '@/components/ui/typography'
import { locationsQueryOptions } from '@/services/tripadvisor/query-options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { LocationCategoryEnum } from '@/services/tripadvisor/api'
import z from 'zod/v4'

const categorySearchSchema = z.object({
  category: LocationCategoryEnum.catch('hotels'),
})

export const Route = createFileRoute('/itineraries/new/$city')({
  component: RouteComponent,
  validateSearch: categorySearchSchema,
  errorComponent: (error) => (
    <ErrorComponent
      {...error}
      description="No activities found for this city."
    />
  ),
})

function RouteComponent() {
  const { city } = Route.useParams()
  const { category } = Route.useSearch()

  const cityLocationsQuery = useSuspenseQuery(
    locationsQueryOptions(city, category),
  )

  return (
    <div className="flex flex-col">
      <TypographyH1>Create an itinerary for {city}</TypographyH1>
      <div className="flex">
        <ul className="flex flex-col gap-2 items-center w-lg max-w-md">
          <TypographyH4 className="capitalize">
            Suggested {category}
          </TypographyH4>
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
