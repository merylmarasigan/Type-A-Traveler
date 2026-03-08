import { DateRangePicker } from '@/components/date-range-picker'
import { TypographyH2, TypographySmall } from '@/components/ui/typography'
import { UserSavedActivities } from '@/components/saved-activities/user-saved-activities'
import { authClient } from '@/lib/auth-client'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/itineraries/create/$city')({
  component: RouteComponent,
})

function RouteComponent() {
  const { city } = Route.useParams()
  const { data } = authClient.useSession()

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-7xl flex flex-col items-start gap-2 md:gap-4 p-2">
        <TypographyH2>Create your itinerary for {city}</TypographyH2>
        {data?.user ? (
          <>
            <DateRangePicker city={city} />
            <UserSavedActivities user={data.user} city={city} />
          </>
        ) : (
          <TypographySmall>Please sign in to continue.</TypographySmall>
        )}
      </div>
    </div>
  )
}
