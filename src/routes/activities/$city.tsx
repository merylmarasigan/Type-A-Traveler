import { LocationPreview } from '@/components/location-preview'
import { ErrorComponent } from '@/components/error'
import { TypographyH2 } from '@/components/ui/typography'
import { locationsQueryOptions } from '@/services/tripadvisor/query-options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { LocationCategoryEnum } from '@/services/tripadvisor/api'
import z from 'zod/v4'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { User } from 'better-auth'
import { ArrowRight } from 'lucide-react'

const categorySearchSchema = z.object({
  category: LocationCategoryEnum.catch('hotels').default('hotels'),
})

export const Route = createFileRoute('/activities/$city')({
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

  const { data } = authClient.useSession()

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-7xl flex flex-col gap-2 md:gap-4 p-2">
        <div className="self-start w-full flex justify-between items-center p-2">
          <TypographyH2>
            Suggested {category} for {city}
          </TypographyH2>
          {data?.user && <ContinueButton user={data.user} />}
        </div>
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
    </div>
  )
}

interface ContinueButtonProps {
  user: User
}

function ContinueButton({ user }: ContinueButtonProps) {
  const { city } = Route.useParams()
  const { activitiesQuery } = useSavedActivities(user.id)

  if (activitiesQuery.data.length === 0) return null

  return (
    <Button asChild>
      <Link to="/itineraries/create/$city" params={{ city }}>
        Create your itinerary
        <ArrowRight />
      </Link>
    </Button>
  )
}
