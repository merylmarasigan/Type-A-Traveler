import { formatDate } from 'date-fns'
import { AlertCircleIcon, Edit, Trash } from 'lucide-react'
import type { ItineraryDay, SavedActivity, TimeSlot } from '@/db/types'
import { SavedActivityPreview } from '@/components/saved-activities/saved-activity-preview'
import { SavedActivitySuggestions } from '@/components/saved-activities/saved-activity-suggestions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { CreateTimeSlot } from '@/components/create-time-slot'

interface TimeSlotDetailsProps {
  timeSlot: TimeSlot
  itineraryDay: ItineraryDay
  activities: Array<SavedActivity>
  cityItineraryId: string
  city: string
}

export function TimeSlotDetails({
  timeSlot,
  itineraryDay,
  activities,
  cityItineraryId,
  city,
}: TimeSlotDetailsProps) {
  if (!timeSlot.startTime || !timeSlot.endTime) return null

  return (
    <div className="flex flex-col gap-2 w-full">
      <ButtonGroup>
        <Button variant="secondary" className="font-mono hover:cursor-default">
          {formatDate(timeSlot.startTime, 'p')} -{' '}
          {formatDate(timeSlot.endTime, 'p')}
        </Button>
        <ButtonGroupSeparator />
        <CreateTimeSlot itineraryDay={itineraryDay} existingTimeSlot={timeSlot}>
          <Button className="rounded-none" variant="secondary">
            <Edit />
          </Button>
        </CreateTimeSlot>
        <ButtonGroupSeparator />
        <Button variant="secondary">
          <Trash />
        </Button>
      </ButtonGroup>
      <div className="flex flex-col gap-2 w-full">
        {activities.length === 0 ? (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>No Activities</AlertTitle>
            <AlertDescription className="flex flex-col gap-2 line-clamp-4">
              <p>This time slot has no activities yet.</p>
              <SavedActivitySuggestions
                cityItineraryId={cityItineraryId}
                timeSlotId={timeSlot.id}
                btnLabel="Add activity"
                city={city}
              />
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-wrap gap-2">
            {activities.map((activity) => (
              <SavedActivityPreview
                key={activity.id}
                id={activity.id}
                city={activity.city}
              />
            ))}
          </div>
        )}
        {activities.length > 0 && (
          <SavedActivitySuggestions
            cityItineraryId={cityItineraryId}
            timeSlotId={timeSlot.id}
            btnLabel="Add another activity"
            align="start"
            city={city}
          />
        )}
      </div>
    </div>
  )
}
