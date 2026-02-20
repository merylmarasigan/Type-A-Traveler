import { ActivityPreview } from '@/components/activity-preview'
import { ErrorComponent } from '@/components/error'
import { TypographyH1, TypographyH4 } from '@/components/ui/typography'
import { activitiesQueryOptions } from '@/services/foursquare/query-options'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/itineraries/new/$city')({
  component: RouteComponent,
  loader: async ({ params: { city }, context }) => {
    const data = await context.queryClient.ensureQueryData(
      activitiesQueryOptions(city),
    )
    console.log(data)

    return data
  },
  errorComponent: (error) => (
    <ErrorComponent
      {...error}
      description="No activities found for this city."
    />
  ),
})

function RouteComponent() {
  const { city } = Route.useParams()
  const cityActivitiesQuery = useSuspenseQuery(activitiesQueryOptions(city))

  return (
    <div className="flex flex-col">
      <TypographyH1>Create an itinerary for {city}</TypographyH1>
      <div className="flex">
        <ul className="flex flex-col gap-2 items-center w-lg max-w-md">
          <TypographyH4>Suggested Activities</TypographyH4>
          {cityActivitiesQuery.data.map((activity) => (
            <ActivityPreview key={activity.fsq_place_id} activity={activity} />
          ))}
        </ul>
      </div>
    </div>
  )
}
