import { useSavedActivities } from '@/hooks/use-saved-activities' // hook that fetches the activities from the database
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SavedActivityCard } from '@/components/saved-activities/saved-activity-card'
import { TypographyH3 } from '@/components/ui/typography'
import { QuickCreateItineraryDialog } from '@/components/itineraries/quick-create-itinerary-dialog'
import { Button } from '@/components/ui/button'
import { CalendarPlus } from 'lucide-react'

interface ActivitiesByCityProps {
  /** Load activities for this user instead of the signed-in user. */
  forUserId?: string
  /** When false, hides the per-city create-itinerary control (e.g. on another user's profile). */
  showCreateItinerary?: boolean
  emptyTitle?: string
  emptyDescription?: string
}

export function ActivitiesByCity({
  forUserId,
  showCreateItinerary = true,
  emptyTitle = 'No saved activities!',
  emptyDescription = 'Save some activities to see them here.',
}: ActivitiesByCityProps = {}) {
  const { userActivitiesQuery } = useSavedActivities(
    forUserId !== undefined ? { forUserId } : {},
  )
  const activities = userActivitiesQuery.data

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
      <Alert>
        <AlertTitle>{emptyTitle}</AlertTitle>
        <AlertDescription>{emptyDescription}</AlertDescription>
      </Alert>
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
