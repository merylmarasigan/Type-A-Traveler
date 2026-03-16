import { TimeSlotDetails } from '@/components/time-slot-details'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ItineraryDay } from '@/db/types'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { useTimeSlots } from '@/hooks/use-time-slots'
import { formatDate } from 'date-fns'
import { Plus } from 'lucide-react'

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

  const todayTimeSlotIds = timeSlotsQuery.data
    .filter((timeSlot) => timeSlot.itineraryDayId === itineraryDay.id)
    .map((timeSlot) => timeSlot.id)

  const todaysActivities = cityActivitiesQuery.data.filter(
    (activity) =>
      activity.timeSlotId && todayTimeSlotIds.includes(activity.timeSlotId),
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{formatDate(itineraryDay.date, 'EEEE')}</CardTitle>
        <CardDescription>
          <Badge variant="secondary">
            {todaysActivities.length} activities
          </Badge>
        </CardDescription>
        <CardAction>
          <Button>
            <Plus /> Add activity
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {timeSlotsQuery.data.map((slot) => (
            <TimeSlotDetails
              key={slot.id}
              timeSlot={slot}
              activities={cityActivitiesQuery.data.filter(
                (activity) => activity.timeSlotId === slot.id,
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
