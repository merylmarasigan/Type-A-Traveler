import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TypographyMuted } from '@/components/ui/typography'
import { CityItinerary } from '@/db/types'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
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

  const first = itineraryDaysQuery.data[0]
  const last = itineraryDaysQuery.data[itineraryDaysQuery.data.length - 1]
  const scheduleDescription = `${formatDate(first.date, 'MMMM do, y')} - ${formatDate(last.date, 'MMMM do, y')}`

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{cityItinerary.title}</CardTitle>
        <CardDescription>{cityItinerary.city}</CardDescription>
      </CardHeader>
      <CardContent>
        <TypographyMuted>{scheduleDescription}</TypographyMuted>
      </CardContent>
      <CardFooter>
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
