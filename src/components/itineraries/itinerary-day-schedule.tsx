import { formatDate } from 'date-fns'
import { AlertCircleIcon, ClockPlus } from 'lucide-react'
import { Suspense } from 'react'
import type { ItineraryDay } from '@/db/types'
import { TimeSlotForm } from '@/components/itineraries/time-slot-form'
import { TimeSlotDetails } from '@/components/itineraries/time-slot-details'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { TypographyLarge } from '@/components/ui/typography'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { useTimeSlots } from '@/hooks/use-time-slots'
import { authClient } from '@/lib/auth-client'

interface ItineraryDayScheduleProps {
  itineraryDay: ItineraryDay
}

export function ItineraryDaySchedule(props: ItineraryDayScheduleProps) {
  return (
    <Suspense fallback={<ItineraryDayScheduleSkeleton />}>
      <ItineraryDayScheduleContent {...props} />
    </Suspense>
  )
}

function ItineraryDayScheduleSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-5 w-24" />
        <CardDescription>
          <Skeleton className="h-5 w-20" />
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-24" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ItineraryDayScheduleContent({
  itineraryDay,
}: ItineraryDayScheduleProps) {
  const { timeSlotsQuery } = useTimeSlots({ itineraryDayId: itineraryDay.id })
  const { cityActivitiesQuery } = useSavedActivities({
    cityItineraryId: itineraryDay.cityItineraryId,
  })
  const { itineraryQuery } = useSingleCityItinerary({
    cityItineraryId: itineraryDay.cityItineraryId,
  })
  const { folderQuery } = useSingleItineraryFolder({
    itineraryFolderId: itineraryQuery.data.folderId,
  })
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
