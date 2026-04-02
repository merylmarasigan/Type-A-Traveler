import { CreateTimeSlot } from '@/components/create-time-slot'
import { TimeSlotDetails } from '@/components/time-slot-details'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { TypographyLarge } from '@/components/ui/typography'
import { ItineraryDay } from '@/db/types'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { useTimeSlots } from '@/hooks/use-time-slots'
import { formatDate } from 'date-fns'
import { AlertCircleIcon } from 'lucide-react'

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
  const { itineraryQuery } = useSingleCityItinerary(
    itineraryDay.cityItineraryId,
  )

  const todayTimeSlotIds = timeSlotsQuery.data
    .filter((timeSlot) => timeSlot.itineraryDayId === itineraryDay.id)
    .map((timeSlot) => timeSlot.id)

  const todaysActivities = cityActivitiesQuery.data.filter(
    (activity) =>
      activity.timeSlotId && todayTimeSlotIds.includes(activity.timeSlotId),
  )

  const dayOfWeek = formatDate(itineraryDay.date, 'EEEE')

  return (
    <Card className="w-full">
      <ScrollArea className="h-full w-full">
        <CardHeader>
          <CardTitle>{dayOfWeek}</CardTitle>
          <CardDescription>
            <Badge variant="secondary">
              {todaysActivities.length} activities
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <TypographyLarge>Time Slots</TypographyLarge>
              <CreateTimeSlot itineraryDay={itineraryDay} />
            </div>

            {timeSlotsQuery.data.length === 0 ? (
              <div className="flex flex-col gap-2 items-center">
                <Alert className="self-center">
                  <AlertCircleIcon />
                  <AlertTitle>No Time Slots</AlertTitle>
                  <AlertDescription>
                    {dayOfWeek} has no time slots yet.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              timeSlotsQuery.data.map((slot) => (
                <div key={slot.id} className="flex flex-col gap-2">
                  <TimeSlotDetails
                    timeSlot={slot}
                    activities={cityActivitiesQuery.data.filter(
                      (activity) => activity.timeSlotId === slot.id,
                    )}
                    cityItineraryId={itineraryDay.cityItineraryId}
                    city={itineraryQuery.data.city}
                  />
                  <CreateTimeSlot itineraryDay={itineraryDay} iconOnly />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  )
}
