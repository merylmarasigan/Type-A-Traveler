import { EditableItineraryTitle } from '@/components/itineraries/editable-itinerary-title'
import { ItineraryDayPreview } from '@/components/itineraries/itinerary-day-preview'
import { ItineraryDaySchedule } from '@/components/itineraries/itinerary-day-schedule'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { TypographyH2, TypographyLarge } from '@/components/ui/typography'
import { ItineraryDay } from '@/db/types'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import { formatDate } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'

export const Route = createFileRoute('/itineraries/cities/$cityId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { cityId } = Route.useParams()
  const { itineraryQuery, updateItineraryMutation } =
    useSingleCityItinerary(cityId)
  const { itineraryDaysQuery } = useItineraryDays(cityId)
  const { cityActivitiesQuery } = useSavedActivities({
    cityItineraryId: cityId,
  })
  const { folderQuery } = useSingleItineraryFolder(itineraryQuery.data.folderId)
  const { data } = authClient.useSession()

  const start = itineraryDaysQuery.data[0]
  const end = itineraryDaysQuery.data[itineraryDaysQuery.data.length - 1]

  const [selectedDay, setSelectedDay] = useState<ItineraryDay>(
    itineraryDaysQuery.data[0],
  )

  const updateTitle = async (value: { title: string | null }) => {
    await updateItineraryMutation.mutateAsync({
      id: cityId,
      title: value.title,
    })
  }

  const authorIsSessionUser = data?.user.id === folderQuery.data.authorId

  return (
    <div className="flex flex-col h-full gap-2 p-2">
      <Button variant="link" asChild className="self-start">
        <Link
          to="/itineraries/$id"
          params={{ id: itineraryQuery.data.folderId }}
        >
          <ArrowLeft />
          {folderQuery.data.title}
        </Link>
      </Button>
      {authorIsSessionUser ? (
        <EditableItineraryTitle
          title={itineraryQuery.data.title}
          id={cityId}
          type="City"
          onSubmit={updateTitle}
          className="text-start"
        />
      ) : (
        <p
          className={cn(
            'h-min w-full col-start-1 col-span-2 md:col-start-2 md:col-span-1',
            'flex flex-wrap justify-between items-center',
            'line-clamp-2text-center text-3xl md:text-4xl font-extrabold',
          )}
        >
          {itineraryQuery.data.title}
        </p>
      )}
      <TypographyH2>
        {formatDate(start.date, 'MMMM do, y')} -{' '}
        {formatDate(end.date, 'MMMM do, y')}
      </TypographyH2>

      <div className="flex items-center gap-2">
        <TypographyLarge>Schedule</TypographyLarge>
        <Badge>{cityActivitiesQuery.data.length ?? 0} activities</Badge>
      </div>

      <div className="flex gap-2 flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 w-36">
            {itineraryDaysQuery.data.map((day, i) => (
              <Fragment key={day.id}>
                <ItineraryDayPreview
                  itineraryDay={day}
                  selected={day.id === selectedDay.id}
                  onClick={() => setSelectedDay(day)}
                />
                {i !== itineraryDaysQuery.data.length - 1 && <Separator />}
              </Fragment>
            ))}
          </div>
        </ScrollArea>

        <ItineraryDaySchedule itineraryDay={selectedDay} />
      </div>
    </div>
  )
}
