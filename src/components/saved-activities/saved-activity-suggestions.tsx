import { SavedActivityPreview } from '@/components/saved-activities/saved-activity-preview'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  CollapsibleContent,
  CollapsibleTrigger,
  Collapsible,
} from '@/components/ui/collapsible'

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { cn } from '@/lib/utils'
import { AlertCircleIcon, MapPinPlus } from 'lucide-react'

interface SavedActivitySuggestionsProps {
  cityItineraryId: string
  timeSlotId: string
  btnLabel: 'Add activity' | 'Add another activity'
  align?: 'start' | 'center'
  city?: string
}

export function SavedActivitySuggestions({
  timeSlotId,
  cityItineraryId,
  btnLabel,
  align,
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
    <Collapsible
      className={cn(
        'flex flex-col w-full gap-2 items-center self-center',
        align === 'start' && 'self-start',
      )}
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="secondary"
          className={cn('self-center', align === 'start' && 'self-start')}
        >
          <MapPinPlus />
          {btnLabel}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ScrollArea className="w-32 md:w-3xl 2xl:w-6xl rounded-md border whitespace-nowrap">
          <div className="flex w-max space-x-4 p-4">
            {notYetAddedActivities.length === 0 ? (
              <Alert>
                <AlertCircleIcon />
                <AlertTitle>No Activities</AlertTitle>
                <AlertDescription>
                  You have no more activities saved for{' '}
                  {itineraryQuery.data.city}.
                </AlertDescription>
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
      </CollapsibleContent>
    </Collapsible>
  )
}
