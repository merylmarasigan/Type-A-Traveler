import { Suspense } from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useItineraryDays } from '@/hooks/use-itinerary-days'

interface ItineraryDaysListProps {
  cityItineraryId: string
}

export function ItineraryDaysList(props: ItineraryDaysListProps) {
  return (
    <Suspense fallback={<ItineraryDaysListSkeleton />}>
      <ItineraryDaysListContent {...props} />
    </Suspense>
  )
}

function ItineraryDaysListSkeleton() {
  return Array.from({ length: 3 }).map((_, i) => (
    <Card key={i}>
      <CardHeader>
        <Skeleton className="h-5 w-28" />
      </CardHeader>
    </Card>
  ))
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
