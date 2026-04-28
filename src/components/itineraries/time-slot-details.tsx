import { formatDate } from 'date-fns'
import { AlertCircleIcon, Edit, MapPinOff, MapPinPlus } from 'lucide-react'
import { Suspense, useState } from 'react'
import type { ItineraryDay, TimeSlot } from '@/db/types'
import { TimeSlotActivityCard } from '@/components/saved-activities/time-slot-activity-card'
import { SavedActivitySuggestions } from '@/components/saved-activities/saved-activity-suggestions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ButtonGroup, ButtonGroupSeparator } from '@/components/ui/button-group'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TimeSlotForm } from '@/components/itineraries/time-slot-form'
import { TypographySmall } from '@/components/ui/typography'
import { TimeSlotDeleteDialog } from '@/components/itineraries/time-slot-delete-dialog'
import { useTimeSlotActivities } from '@/hooks/use-time-slot-activities'

interface TimeSlotDetailsProps {
  timeSlot: TimeSlot
  itineraryDay: ItineraryDay
  cityItineraryId: string
  city: string
  showActions: boolean
}

export function TimeSlotDetails(props: TimeSlotDetailsProps) {
  return (
    <Suspense fallback={<TimeSlotDetailsSkeleton />}>
      <TimeSlotDetailsContent {...props} />
    </Suspense>
  )
}

function TimeSlotDetailsSkeleton() {
  return (
    <div className="flex flex-col gap-2 w-full p-2 border rounded-md">
      <Skeleton className="h-9 w-48" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-48 rounded-md" />
        ))}
      </div>
    </div>
  )
}

function TimeSlotDetailsContent({
  timeSlot,
  itineraryDay,
  cityItineraryId,
  city,
  showActions,
}: TimeSlotDetailsProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { timeSlotActivitiesQuery } = useTimeSlotActivities({
    timeSlotId: timeSlot.id,
  })
  const activities = timeSlotActivitiesQuery.data

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
                <TimeSlotActivityCard
                  key={activity.timeSlotActivityId}
                  timeSlotActivityId={activity.timeSlotActivityId}
                  savedActivityId={activity.savedActivityId ?? undefined}
                  name={activity.name}
                  description={activity.description ?? undefined}
                  imageUrl={activity.imageUrl ?? undefined}
                  timeSlotId={timeSlot.id}
                  cityItineraryId={cityItineraryId}
                  city={city}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
