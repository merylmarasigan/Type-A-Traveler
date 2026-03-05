import { LocationPreview } from '@/components/location-preview'
import { ErrorComponent } from '@/components/error'
import { TypographyH2 } from '@/components/ui/typography'
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
    <div className="flex flex-col items-center gap-2 md:gap-4 p-2">
      <TypographyH2>
        Suggested {category} for {city}
      </TypographyH2>
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 max-w-7xl">
        {cityLocationsQuery.data.map((location) => (
          <LocationPreview
            key={location.location_id}
            city={city}
            location={location}
          />
        ))}
      </ul>
    </div>
  )
}
