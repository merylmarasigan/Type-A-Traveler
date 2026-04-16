import { Suspense } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { useItineraryDays } from '@/hooks/use-itinerary-days'

interface ItineraryDaysListProps {
  cityItineraryId: string
}

export function ItineraryDaysList(props: ItineraryDaysListProps) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ItineraryDaysListContent {...props} />
    </Suspense>
  )
}

function ItineraryDaysListContent({ cityItineraryId }: ItineraryDaysListProps) {
  const { itineraryDaysQuery } = useItineraryDays(cityItineraryId)

  return itineraryDaysQuery.data.map((day) => (
    <Card key={day.id}>
      <CardHeader>
        <CardTitle>{day.date.toString()}</CardTitle>
      </CardHeader>
    </Card>
  ))
}
