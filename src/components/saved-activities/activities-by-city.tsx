import { useSavedActivities } from '@/hooks/use-saved-activities' // hook that fetches the activities from the database
import { SavedActivityCard } from '@/components/saved-activities/saved-activity-card'
import { TypographyH3 } from '@/components/ui/typography'
import { QuickCreateItineraryDialog } from '@/components/itineraries/quick-create-itinerary-dialog'
import { Button } from '@/components/ui/button'
import { CalendarPlus, FolderPlus, MapPin } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Link } from '@tanstack/react-router'
import { authClient } from '@/lib/auth-client'

interface ActivitiesByCityProps {
  /** Load activities for this user instead of the signed-in user. */
  forUserId?: string
  /** When false, hides the per-city create-itinerary control (e.g. on another user's profile). */
  showCreateItinerary?: boolean
  emptyTitle?: string
  emptyDescription?: string
  userShowsSavedActivitiesOnProfile?: boolean
}

export function ActivitiesByCity({
  forUserId,
  showCreateItinerary = true,
  emptyTitle = 'No saved activities!',
  emptyDescription = 'Save some activities to see them here.',
  userShowsSavedActivitiesOnProfile,
}: ActivitiesByCityProps = {}) {
  const { userActivitiesQuery } = useSavedActivities(
    forUserId !== undefined
      ? { forUserId, userShowsSavedActivitiesOnProfile }
      : {},
  )
  const activities = userActivitiesQuery.data
  const { data: session } = authClient.useSession()
  const isOwner = session?.user.id === forUserId

  const grouped = activities.reduce<Record<string, typeof activities>>(
    (acc, activity) => {
      const city = activity.city
      if (!acc[city]) acc[city] = []
      acc[city].push(activity)
      return acc
    },
    {},
  )

  const cities = Object.keys(grouped).sort()

  if (cities.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <MapPin />
          </EmptyMedia>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
        {isOwner && (
          <EmptyContent className="flex-row justify-center gap-2">
            <Button asChild>
              <Link to="/">
                <FolderPlus />
                Find activities
              </Link>
            </Button>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {cities.map((city) => (
        <section key={city}>
          <div className="flex items-center justify-between gap-2 mb-4 border-b pb-2">
            <TypographyH3>{city}</TypographyH3>
            {showCreateItinerary && (
              <QuickCreateItineraryDialog
                defaultCity={city}
                trigger={
                  <Button variant="outline" size="sm">
                    <CalendarPlus />
                    Create itinerary
                  </Button>
                }
              />
            )}
          </div>
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {grouped[city].map((activity) => (
              <SavedActivityCard key={activity.id} id={activity.id} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
