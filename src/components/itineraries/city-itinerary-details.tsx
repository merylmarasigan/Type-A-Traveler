import { useRouter } from '@tanstack/react-router'
import { formatDate } from 'date-fns'
import { MapPin } from 'lucide-react'
import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'
import type { ItineraryDay } from '@/db/types'
import { EditItineraryDialog } from '@/components/itineraries/edit-itinerary-dialog'
import { EditScheduleDialog } from '@/components/itineraries/edit-schedule-dialog'
import { ItineraryDayPreview } from '@/components/itineraries/itinerary-day-preview'
import { ItineraryDaySchedule } from '@/components/itineraries/itinerary-day-schedule'
import { Badge } from '@/components/ui/badge'
import { parseLocalDate } from '@/lib/utils'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH3,
  TypographyLarge,
} from '@/components/ui/typography'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { authClient } from '@/lib/auth-client'

interface CityItineraryDetailsProps {
  id: string
}

export function CityItineraryDetails({ id }: CityItineraryDetailsProps) {
  const { itineraryQuery, updateItineraryMutation, deleteItineraryMutation } =
    useSingleCityItinerary(id)
  const { folderQuery } = useSingleItineraryFolder(itineraryQuery.data.folderId)
  const { itineraryDaysQuery } = useItineraryDays(id)
  const { cityActivitiesQuery } = useSavedActivities({
    cityItineraryId: id,
  })
  const router = useRouter()
  const { data } = authClient.useSession()

  const start = itineraryDaysQuery.data[0]
  const end = itineraryDaysQuery.data[itineraryDaysQuery.data.length - 1]

  const [selectedDay, setSelectedDay] = useState<ItineraryDay>(
    itineraryDaysQuery.data[0],
  )

  const updateTitle = async (value: {
    title: string | null
    description: string | null
  }) => {
    await updateItineraryMutation.mutateAsync({
      id,
      title: value.title,
      description: value.description,
    })
  }

  const deleteCityItinerary = async () => {
    const { remainingCities } = await deleteItineraryMutation.mutateAsync(id)

    if (remainingCities.length >= 1) {
      await router.navigate({
        to: '/itineraries/$id',
        params: { id: folderQuery.data.id },
      })
    } else {
      await router.navigate({ to: '/my-itineraries' })
    }
  }

  const authorIsSessionUser = data?.user.id === folderQuery.data.authorId

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="self-start flex gap-2 items-center justify-start">
          <MapPin className="size-12 md:size-6 self-start md:self-center" />
          <TypographyH1 className="text-start">
            {itineraryQuery.data.title}
          </TypographyH1>
        </CardTitle>

        {itineraryQuery.data.description && (
          <CardDescription>
            <TypographyBlockquote>
              {itineraryQuery.data.description}
            </TypographyBlockquote>
          </CardDescription>
        )}

        {authorIsSessionUser && (
          <CardAction>
            <EditItineraryDialog
              title={itineraryQuery.data.title}
              description={itineraryQuery.data.description}
              id={id}
              type="City"
              onSubmit={updateTitle}
              onDelete={deleteCityItinerary}
              className="self-start"
            />
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <TypographyH3>
          {formatDate(parseLocalDate(start.date), 'MMMM do, y')} -{' '}
          {formatDate(parseLocalDate(end.date), 'MMMM do, y')}
        </TypographyH3>

        <div className="flex items-center gap-2">
          <TypographyLarge>Schedule</TypographyLarge>
          <Badge>
            {cityActivitiesQuery.data.length}{' '}
            {cityActivitiesQuery.data.length === 1 ? 'activity' : 'activities'}
          </Badge>
        </div>

        <div className="flex gap-2 flex-col md:flex-row flex-1 min-h-0">
          <div className="flex flex-col gap-2 items-center justify">
            {authorIsSessionUser && <EditScheduleDialog cityItineraryId={id} />}
            <ScrollArea className="w-full md:w-auto md:h-full border rounded-md p-2">
              <div className="grid grid-flow-col md:grid-flow-row gap-2 md:w-36 pb-2 md:pb-0">
                {itineraryDaysQuery.data.map((day, i) => (
                  <Fragment key={day.id}>
                    <ItineraryDayPreview
                      itineraryDay={day}
                      selected={day.id === selectedDay.id}
                      onClick={() => setSelectedDay(day)}
                    />
                    {i !== itineraryDaysQuery.data.length - 1 && (
                      <Separator
                        orientation={undefined}
                        className="hidden md:block"
                      />
                    )}
                  </Fragment>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="md:hidden" />
            </ScrollArea>
          </div>
          <ItineraryDaySchedule itineraryDay={selectedDay} />
        </div>
      </CardContent>
    </Card>
  )
}
