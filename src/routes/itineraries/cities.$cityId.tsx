import { ItineraryDayPreview } from '@/components/itinerary-day-preview'
import { ItineraryDaySchedule } from '@/components/itinerary-day-schedule'
import { Separator } from '@/components/ui/separator'
import {
  TypographyH1,
  TypographyH2,
  TypographyLarge,
} from '@/components/ui/typography'
import { ItineraryDay } from '@/db/types'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { createFileRoute } from '@tanstack/react-router'
import { formatDate } from 'date-fns'
import { useState } from 'react'
import { Fragment } from 'react/jsx-runtime'

export const Route = createFileRoute('/itineraries/cities/$cityId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { cityId } = Route.useParams()
  const { itineraryQuery } = useSingleCityItinerary(cityId)
  const { itineraryDaysQuery } = useItineraryDays(cityId)

  const start = itineraryDaysQuery.data[0]
  const end = itineraryDaysQuery.data[itineraryDaysQuery.data.length - 1]

  const [selectedDay, setSelectedDay] = useState<ItineraryDay>(
    itineraryDaysQuery.data[0],
  )

  return (
    <div className="flex flex-col gap-2 p-2">
      <TypographyH1 className="text-start">
        {itineraryQuery.data.title}
      </TypographyH1>
      <TypographyH2>
        {formatDate(start.date, 'MMMM do, y')} -{' '}
        {formatDate(end.date, 'MMMM do, y')}
      </TypographyH2>

      <TypographyLarge>Schedule</TypographyLarge>
      <div className="flex gap-2">
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

        <ItineraryDaySchedule itineraryDay={selectedDay} />
      </div>
    </div>
  )
}
