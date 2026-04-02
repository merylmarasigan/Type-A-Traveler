import { SavedActivityPreview } from '@/components/saved-activities/saved-activity-preview'
import { SavedActivitySuggestions } from '@/components/saved-activities/saved-activity-suggestions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { TypographySmall } from '@/components/ui/typography'
import { SavedActivity, TimeSlot } from '@/db/types'
import { formatDate } from 'date-fns'
import { AlertCircleIcon } from 'lucide-react'

interface TimeSlotDetailsProps {
  timeSlot: TimeSlot
  activities: SavedActivity[]
  cityItineraryId: string
  city: string
}

export function TimeSlotDetails({
  timeSlot,
  activities,
  cityItineraryId,
  city,
}: TimeSlotDetailsProps) {
  if (!timeSlot.startTime || !timeSlot.endTime) return null

  return (
    <div className="flex flex-col gap-2 w-full">
      <TypographySmall>
        {formatDate(timeSlot.startTime, 'p')} -{' '}
        {formatDate(timeSlot.endTime, 'p')}
      </TypographySmall>
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
