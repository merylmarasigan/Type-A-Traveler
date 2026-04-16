import { Button } from '@/components/ui/button'
import { parseLocalDate } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TypographyMuted, TypographySmall } from '@/components/ui/typography'
import { CityItinerary } from '@/db/types'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { Link } from '@tanstack/react-router'
import { formatDate } from 'date-fns'
import { Eye } from 'lucide-react'

interface CityItineraryPreviewProps {
  cityItinerary: CityItinerary
}

export function CityItineraryPreview({
  cityItinerary,
}: CityItineraryPreviewProps) {
  const { itineraryDaysQuery } = useItineraryDays(cityItinerary.id)
  const { cityActivitiesQuery } = useSavedActivities({
    cityItineraryId: cityItinerary.id,
  })

  const first = itineraryDaysQuery.data[0]
  const last = itineraryDaysQuery.data[itineraryDaysQuery.data.length - 1]
  const scheduleDescription = `${formatDate(parseLocalDate(first.date), 'MMMM do, y')} - ${formatDate(parseLocalDate(last.date), 'MMMM do, y')}`
  return (
    <Card className="w-full md:w-96 md:max-w-md">
      <CardHeader>
        <CardTitle>{cityItinerary.title}</CardTitle>
        <CardDescription>{cityItinerary.city}</CardDescription>
      </CardHeader>
      <CardContent>
        <TypographySmall>
          {cityActivitiesQuery.data.length}{' '}
          {cityActivitiesQuery.data.length === 1 ? 'activity' : 'activities'}
        </TypographySmall>
      </CardContent>
      <CardFooter className="justify-between">
        <TypographyMuted>{scheduleDescription}</TypographyMuted>

        <Button asChild>
          <Link
            to="/itineraries/cities/$cityId"
            params={{ cityId: cityItinerary.id }}
          >
            <Eye />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
