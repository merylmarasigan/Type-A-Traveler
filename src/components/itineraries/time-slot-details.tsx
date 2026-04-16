import { formatDate } from 'date-fns'
import { AlertCircleIcon, Edit, MapPinOff, MapPinPlus } from 'lucide-react'
import { useState } from 'react'
import type { ItineraryDay, SavedActivity, TimeSlot } from '@/db/types'
import { SavedActivityPreview } from '@/components/saved-activities/saved-activity-preview'
import { SavedActivitySuggestions } from '@/components/saved-activities/saved-activity-suggestions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { TimeSlotForm } from '@/components/itineraries/time-slot-form'
import { TimeSlotActivityOptions } from '@/components/itineraries/time-slot-activity-options'
import { TypographySmall } from '@/components/ui/typography'
import { TimeSlotDeleteDialog } from '@/components/itineraries/time-slot-delete-dialog'

interface TimeSlotDetailsProps {
  timeSlot: TimeSlot
  itineraryDay: ItineraryDay
  activities: Array<SavedActivity>
  cityItineraryId: string
  city: string
  showActions: boolean
}

export function TimeSlotDetails({
  timeSlot,
  itineraryDay,
  activities,
  cityItineraryId,
  city,
  showActions,
}: TimeSlotDetailsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)

  if (!timeSlot.startTime || !timeSlot.endTime) return null
  return (
    <div className="flex flex-col gap-2 w-full p-2 border rounded-md">
      <ButtonGroup className="self-center md:self-start md:w-full">
        <Button variant="secondary" className="font-mono hover:cursor-default">
          {formatDate(timeSlot.startTime, 'p')} -{' '}
          {formatDate(timeSlot.endTime, 'p')}
        </Button>
        {showActions && (
          <>
            <ButtonGroupSeparator />
            <TimeSlotForm
              itineraryDay={itineraryDay}
              existingTimeSlot={timeSlot}
            >
              <Button className="rounded-none" variant="secondary">
                <Edit />
              </Button>
            </TimeSlotForm>
            <ButtonGroupSeparator />
            <TimeSlotDeleteDialog timeSlot={timeSlot} />
            <ButtonGroupSeparator />
            <Button
              onClick={() => setShowSuggestions((prev) => !prev)}
              variant="secondary"
            >
              {showSuggestions ? <MapPinOff /> : <MapPinPlus />}
              <span className="hidden md:block">
                {showSuggestions
                  ? 'Hide'
                  : `Add ${activities.length > 0 ? 'another' : ''} activity`}
              </span>
            </Button>
          </>
        )}
      </ButtonGroup>
      {showSuggestions && (
        <SavedActivitySuggestions
          cityItineraryId={cityItineraryId}
          timeSlotId={timeSlot.id}
          btnLabel="Add another activity"
          align="start"
          city={city}
        />
      )}
      <div className="flex flex-col gap-2 w-full">
        {activities.length === 0 ? (
          <Alert>
            <AlertCircleIcon />
            <AlertTitle>No Activities</AlertTitle>
            <AlertDescription className="flex flex-col gap-2 line-clamp-4">
              <p>This time slot has no activities yet.</p>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="flex flex-col gap-2">
            <TypographySmall>Activities</TypographySmall>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <div key={activity.id} className="flex flex-col gap-1">
                  <SavedActivityPreview id={activity.id} city={activity.city} />
                  <TimeSlotActivityOptions activity={activity} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
