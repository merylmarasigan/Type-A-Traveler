import { SavedActivityPreview } from '@/components/saved-activities/saved-activity-preview'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { TypographySmall } from '@/components/ui/typography'
import { SavedActivity, TimeSlot } from '@/db/types'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { formatDate } from 'date-fns'
import { AlertCircleIcon, MapPinPlus } from 'lucide-react'

interface TimeSlotDetailsProps {
  timeSlot: TimeSlot
  activities: SavedActivity[]
  cityItineraryId: string
}

export function TimeSlotDetails({
  timeSlot,
  activities,
  cityItineraryId,
}: TimeSlotDetailsProps) {
  const { itineraryQuery } = useSingleCityItinerary(cityItineraryId)
  const { userActivitiesQuery } = useSavedActivities({
    city: itineraryQuery.data.city,
  })

  const notYetAddedActivities = userActivitiesQuery.data.filter(
    (activity) =>
      activity.timeSlotId === null &&
      activity.city === itineraryQuery.data.city,
  )

  if (!timeSlot.startTime || !timeSlot.endTime) return null

  return (
    <div className="flex flex-col gap-2">
      <TypographySmall>
        {formatDate(timeSlot.startTime, 'p')} -{' '}
        {formatDate(timeSlot.endTime, 'p')}
      </TypographySmall>
      <div className="flex flex-wrap gap-2">
        {activities.length === 0 ? (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>No Activities</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>This time slot has no activities yet.</p>
              <Collapsible className="flex flex-col gap-2 items-center self-center">
                <CollapsibleTrigger asChild>
                  <Button variant="secondary" className="self-center">
                    <MapPinPlus />
                    Add activity
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ScrollArea className="w-32 md:w-3xl lg:w-6xl rounded-md border whitespace-nowrap">
                    <div className="flex w-max space-x-4 p-4">
                      {notYetAddedActivities.map((activity) => (
                        <SavedActivityPreview
                          key={activity.id}
                          id={activity.id}
                          timeSlotId={timeSlot.id}
                          cityItineraryId={cityItineraryId}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CollapsibleContent>
              </Collapsible>
            </AlertDescription>
          </Alert>
        ) : (
          activities.map((activity) => (
            <SavedActivityPreview key={activity.id} id={activity.id} />
          ))
        )}
      </div>
    </div>
  )
}
