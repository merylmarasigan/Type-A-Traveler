import { TimeSlotDetails } from '@/components/time-slot-details'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ItineraryDay } from '@/db/types'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { useTimeSlots } from '@/hooks/use-time-slots'
import { formatDate } from 'date-fns'

interface ItineraryDayScheduleProps {
  itineraryDay: ItineraryDay
}

export function ItineraryDaySchedule({
  itineraryDay,
}: ItineraryDayScheduleProps) {
  const { timeSlotsQuery } = useTimeSlots(itineraryDay.id)
  const { cityActivitiesQuery } = useSavedActivities({
    cityItineraryId: itineraryDay.cityItineraryId,
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{formatDate(itineraryDay.date, 'EEEE')}</CardTitle>
        <CardDescription>
          {cityActivitiesQuery.data.length} activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        {timeSlotsQuery.data.map((slot) => (
          <TimeSlotDetails
            key={slot.id}
            timeSlot={slot}
            activities={cityActivitiesQuery.data.filter(
              (activity) => activity.timeSlotId === slot.id,
            )}
          />
        ))}
      </CardContent>
    </Card>
  )
}
