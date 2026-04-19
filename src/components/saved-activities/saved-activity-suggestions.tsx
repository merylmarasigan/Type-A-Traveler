import { AlertCircleIcon } from 'lucide-react'
import { Suspense } from 'react'
import { Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { SavedActivitySuggestionCard } from '@/components/saved-activities/saved-activity-suggestion-card'
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { TypographySmall } from '@/components/ui/typography'
import { unlinkedActivitiesQueryOptions } from '@/services/backend/saved-activities.options'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { authClient } from '@/lib/auth-client'

interface SavedActivitySuggestionsProps {
  cityItineraryId: string
  timeSlotId: string
  btnLabel: 'Add activity' | 'Add another activity'
  align?: 'start' | 'center'
  city?: string
}

export function SavedActivitySuggestions(props: SavedActivitySuggestionsProps) {
  return (
    <Suspense fallback={<SavedActivitySuggestionsSkeleton />}>
      <SavedActivitySuggestionsContent {...props} />
    </Suspense>
  )
}

function SavedActivitySuggestionsSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="w-full min-w-0 max-w-full rounded-md border md:max-w-3xl 2xl:max-w-6xl">
        <TypographySmall className="text-primary p-2">
          Suggestions
        </TypographySmall>
        <div className="flex space-x-4 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-32 shrink-0 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}

function SavedActivitySuggestionsContent({
  timeSlotId,
  cityItineraryId,
  city,
}: SavedActivitySuggestionsProps) {
  const { data: session } = authClient.useSession()
  const { itineraryQuery } = useSingleCityItinerary({ cityItineraryId })

  const itineraryCity = itineraryQuery.data.city
  const userId = session?.user.id ?? ''

  const unlinkedActivitiesQuery = useSuspenseQuery(
    unlinkedActivitiesQueryOptions(timeSlotId, userId, itineraryCity),
  )

  const suggestions = unlinkedActivitiesQuery.data

  return (
    <div className="flex flex-col gap-2 w-full">
      <ScrollArea className="w-full min-w-0 max-w-full rounded-md border whitespace-nowrap md:max-w-3xl 2xl:max-w-6xl">
        <TypographySmall className="text-primary p-2">
          Suggestions
        </TypographySmall>

        <div className="flex w-max space-x-4 p-4">
          {suggestions.length === 0 ? (
            <Alert>
              <AlertCircleIcon />
              <AlertTitle>No Activities</AlertTitle>
              <AlertDescription>
                You have no more activities saved for {itineraryCity}.
              </AlertDescription>
              <AlertAction>
                <Button size="xs" variant="default" asChild>
                  <Link
                    to="/activities/$city"
                    params={{ city: itineraryCity }}
                    search={{
                      category: 'hotels',
                      lat: itineraryQuery.data.lat,
                      lng: itineraryQuery.data.lng,
                    }}
                  >
                    Search
                  </Link>
                </Button>
              </AlertAction>
            </Alert>
          ) : (
            suggestions.map((activity) => (
              <SavedActivitySuggestionCard
                key={activity.id}
                id={activity.id}
                timeSlotId={timeSlotId}
                cityItineraryId={cityItineraryId}
                city={city ?? itineraryCity}
              />
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
