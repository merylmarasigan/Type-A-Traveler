import { AlertCircleIcon } from 'lucide-react'
import { Suspense } from 'react'
import { Link } from '@tanstack/react-router'
import { SavedActivityPreview } from '@/components/saved-activities/saved-activity-preview'
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { TypographySmall } from '@/components/ui/typography'

interface SavedActivitySuggestionsProps {
  cityItineraryId: string
  timeSlotId: string
  btnLabel: 'Add activity' | 'Add another activity'
  align?: 'start' | 'center'
  city?: string
}

export function SavedActivitySuggestions(props: SavedActivitySuggestionsProps) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SavedActivitySuggestionsContent {...props} />
    </Suspense>
  )
}

function SavedActivitySuggestionsContent({
  timeSlotId,
  cityItineraryId,
  city,
}: SavedActivitySuggestionsProps) {
  const { itineraryQuery } = useSingleCityItinerary(cityItineraryId)

  const { userActivitiesQuery } = useSavedActivities({
    city: itineraryQuery.data.city,
  })

  const notYetAddedActivities = userActivitiesQuery.data.filter(
    (activity) =>
      activity.timeSlotId === null &&
      activity.city === itineraryQuery.data.city,
  )

  return (
    <div className="flex flex-col gap-2 w-full">
      <ScrollArea className="w-32 md:w-3xl 2xl:w-6xl rounded-md border whitespace-nowrap">
        <TypographySmall className="text-primary p-2">
          Suggestions
        </TypographySmall>

        <div className="flex w-max space-x-4 p-4">
          {notYetAddedActivities.length === 0 ? (
            <Alert>
              <AlertCircleIcon />
              <AlertTitle>No Activities</AlertTitle>
              <AlertDescription>
                You have no more activities saved for {itineraryQuery.data.city}
                .
              </AlertDescription>
              <AlertAction>
                <Button size="xs" variant="default" asChild>
                  <Link
                    to="/activities/$city"
                    params={{ city: itineraryQuery.data.city }}
                    search={{
                      category: 'hotels',
                      lat: itineraryQuery.data.city,
                      lng: itineraryQuery.data.lng,
                    }}
                  >
                    Search
                  </Link>
                </Button>
              </AlertAction>
            </Alert>
          ) : (
            notYetAddedActivities.map((activity) => (
              <SavedActivityPreview
                key={activity.id}
                id={activity.id}
                timeSlotId={timeSlotId}
                cityItineraryId={cityItineraryId}
                city={city}
              />
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
