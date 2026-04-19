import { useSavedActivities } from '@/hooks/use-saved-activities' // hook that fetches the activities from the database
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SavedActivityCard } from '@/components/saved-activities/saved-activity-card'
import { TypographyH3 } from '@/components/ui/typography'
import { QuickCreateItineraryDialog } from '@/components/itineraries/quick-create-itinerary-dialog'
import { Button } from '@/components/ui/button'
import { CalendarPlus } from 'lucide-react'

export function ActivitiesByCity() {
  const { userActivitiesQuery } = useSavedActivities({}) // fetches all activities for the logged in user, regardless of city. We will filter by city in the UI. We could also create a new hook that accepts a city parameter and only fetches activities for that city, but this is simpler for now.
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
        <AlertTitle>No saved activities!</AlertTitle>
        <AlertDescription>
          Save some activities to see them here.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      {cities.map((city) => (
        <section key={city}>
          <div className="flex items-center justify-between gap-2 mb-4 border-b pb-2">
            <TypographyH3>{city}</TypographyH3>
            <QuickCreateItineraryDialog
              defaultCity={city}
              trigger={
                <Button variant="outline" size="sm">
                  <CalendarPlus />
                  Create itinerary
                </Button>
              }
            />
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
