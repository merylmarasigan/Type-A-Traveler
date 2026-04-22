import { Suspense } from 'react'
import { Link } from '@tanstack/react-router'
import { formatDate } from 'date-fns'
import { MapPin } from 'lucide-react'
import { Image } from '@unpic/react'
import type { CityItinerary } from '@/db/types'
import { cn, parseLocalDate } from '@/lib/utils'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TypographyMuted, TypographySmall } from '@/components/ui/typography'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
import { useSavedActivities } from '@/hooks/use-saved-activities'

interface CityItineraryPreviewProps {
  cityItinerary: CityItinerary
  showAuthor?: boolean
  author?: string
  /** When set with `showAuthor`, links the author name to their profile. */
  authorUsername?: string
}

export function CityItineraryPreview(props: CityItineraryPreviewProps) {
  return (
    <Suspense fallback={<CityItineraryPreviewSkeleton />}>
      <CityItineraryPreviewContent {...props} />
    </Suspense>
  )
}

function CityItineraryPreviewSkeleton() {
  return (
    <Card className="w-full overflow-hidden pt-0 md:w-96 md:max-w-md">
      <Skeleton className="h-44 w-full rounded-none sm:h-48" />
      <CardHeader>
        <Skeleton className="h-5 w-1/2" />
        <CardDescription>
          <Skeleton className="h-4 w-1/3" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-24" />
      </CardContent>
      <CardFooter className="justify-between">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-9 w-16" />
      </CardFooter>
    </Card>
  )
}

function CityItineraryPreviewContent({
  cityItinerary,
  showAuthor,
  author,
  authorUsername,
}: CityItineraryPreviewProps) {
  const { itineraryDaysQuery } = useItineraryDays({
    cityItineraryId: cityItinerary.id,
  })
  const { cityActivitiesQuery } = useSavedActivities({
    cityItineraryId: cityItinerary.id,
  })

  const first = itineraryDaysQuery.data[0]
  const last = itineraryDaysQuery.data[itineraryDaysQuery.data.length - 1]

  if (!first || !last) return <CityItineraryPreviewSkeleton />

  const thumbUrls = cityActivitiesQuery.data
    .flatMap((a) => (a.imageUrl ? [a.imageUrl] : []))
    .slice(0, 4)
  const uniqueThumbUrls = [...new Set(thumbUrls)]

  const scheduleDescription = `${formatDate(parseLocalDate(first.date), 'MMMM do, y')} - ${formatDate(parseLocalDate(last.date), 'MMMM do, y')}`

  const itineraryLinkBody = (
    <>
      {uniqueThumbUrls.length > 0 ? (
        <div
          className={cn(
            'grid h-44 w-full gap-0.5 bg-muted sm:h-48',
            uniqueThumbUrls.length === 1 && 'grid-cols-1 grid-rows-1',
            uniqueThumbUrls.length === 2 && 'grid-cols-2 grid-rows-1',
            (uniqueThumbUrls.length === 3 || uniqueThumbUrls.length === 4) &&
              'grid-cols-2 grid-rows-[minmax(0,1fr)_minmax(0,1fr)]',
          )}
        >
          {uniqueThumbUrls.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className={cn(
                'relative min-h-0 overflow-hidden',
                uniqueThumbUrls.length === 3 && index === 2 && 'col-span-2',
              )}
            >
              <Image
                src={url}
                alt={`${cityItinerary.city} activity preview ${index + 1}`}
                layout="constrained"
                width={320}
                height={240}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="h-44 w-full shrink-0 bg-muted sm:h-48" aria-hidden />
      )}
      <CardHeader>
        <CardTitle className="flex flex-col gap-1">
          <div className="flex items-center gap-2">{cityItinerary.title}</div>
        </CardTitle>
        {uniqueThumbUrls.length > 0 && (
          <CardDescription>{cityItinerary.city}</CardDescription>
        )}
        <CardAction>
          <MapPin />
        </CardAction>
      </CardHeader>
      {uniqueThumbUrls.length === 0 && (
        <CardContent>
          <TypographySmall>
            {cityActivitiesQuery.data.length}{' '}
            {cityActivitiesQuery.data.length === 1 ? 'activity' : 'activities'}
          </TypographySmall>
        </CardContent>
      )}
      {uniqueThumbUrls.length === 0 && (
        <CardFooter className="justify-between">
          <TypographyMuted>{scheduleDescription}</TypographyMuted>
        </CardFooter>
      )}
    </>
  )

  return (
    <Link
      to="/itineraries/cities/$cityId"
      params={{ cityId: cityItinerary.id }}
      className="block rounded-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="w-full overflow-hidden pt-0 md:w-96 md:max-w-md">
        {itineraryLinkBody}
        {showAuthor && (
          <CardFooter>
            <TypographyMuted>
              by{' '}
              {authorUsername ? (
                <Link
                  to="/profile/$username"
                  params={{ username: authorUsername }}
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {author}
                </Link>
              ) : (
                author
              )}
            </TypographyMuted>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
