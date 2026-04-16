import { formatDate } from 'date-fns'
import { AlertCircleIcon, ClockPlus } from 'lucide-react'
import { Suspense } from 'react'
import type { ItineraryDay } from '@/db/types'
import { TimeSlotForm } from '@/components/time-slot-form'
import { TimeSlotDetails } from '@/components/time-slot-details'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { useTimeSlots } from '@/hooks/use-time-slots'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface ItineraryDayScheduleProps {
  itineraryDay: ItineraryDay
}

export function ItineraryDaySchedule(props: ItineraryDayScheduleProps) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ItineraryDayScheduleContent {...props} />
    </Suspense>
  )
}

function ItineraryDayScheduleContent({
  itineraryDay,
}: ItineraryDayScheduleProps) {
  const { timeSlotsQuery } = useTimeSlots(itineraryDay.id)
  const { cityActivitiesQuery } = useSavedActivities({
    cityItineraryId: itineraryDay.cityItineraryId,
  })
  const { itineraryQuery } = useSingleCityItinerary(
    itineraryDay.cityItineraryId,
  )
  const { folderQuery } = useSingleItineraryFolder(itineraryQuery.data.folderId)
  const { data } = authClient.useSession()

  const todayTimeSlotIds = timeSlotsQuery.data
    .filter((timeSlot) => timeSlot.itineraryDayId === itineraryDay.id)
    .map((timeSlot) => timeSlot.id)

  const todaysActivities = cityActivitiesQuery.data.filter(
    (activity) =>
      activity.timeSlotId && todayTimeSlotIds.includes(activity.timeSlotId),
  )

  const dayOfWeek = formatDate(itineraryDay.date, 'EEEE')

  const authorIsSessionUser = data?.user.id === folderQuery.data.authorId

  return (
    <Card className="w-full">
      <ScrollArea className="h-full w-full">
        <CardHeader>
          <CardTitle>{dayOfWeek}</CardTitle>
          <CardDescription>
            <Badge variant="secondary">
              {todaysActivities.length}{' '}
              {todaysActivities.length === 1 ? 'activity' : 'activities'}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <TypographyLarge>Time Slots</TypographyLarge>
              {authorIsSessionUser && (
                <TimeSlotForm itineraryDay={itineraryDay}>
                  <Button>
                    <ClockPlus />
                    Add time slot
                  </Button>
                </TimeSlotForm>
              )}
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
              timeSlotsQuery.data.map((slot, index) => (
                <div key={slot.id} className="flex flex-col gap-2">
                  <TimeSlotDetails
                    timeSlot={slot}
                    itineraryDay={itineraryDay}
                    activities={cityActivitiesQuery.data.filter(
                      (activity) => activity.timeSlotId === slot.id,
                    )}
                    cityItineraryId={itineraryDay.cityItineraryId}
                    city={itineraryQuery.data.city}
                    showActions={authorIsSessionUser}
                  />
                  {authorIsSessionUser && (
                    <>
                      <TimeSlotForm
                        itineraryDay={itineraryDay}
                        slotId={slot.id}
                      >
                        <Button variant="ghost">
                          <ClockPlus />
                          Add time slot
                        </Button>
                      </TimeSlotForm>
                      {index !== timeSlotsQuery.data.length - 1 && (
                        <Separator />
                      )}
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  )
}
