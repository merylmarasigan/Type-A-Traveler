import { Suspense } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { useQueries } from '@tanstack/react-query'
import { Folder } from 'lucide-react'
import { Image } from '@unpic/react'
import type { ItineraryFolder } from '@/db/types'
import { CityItineraryPreview } from '@/components/itineraries/city-itinerary-preview'
import { Badge } from '@/components/ui/badge'
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
import { TypographyMuted } from '@/components/ui/typography'
import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { useSingleUser } from '@/hooks/use-single-user'
import { cn } from '@/lib/utils'
import { cityItinerarySavedActivitiesQueryOptions } from '@/services/backend/saved-activities.options'
import { authClient } from '@/lib/auth-client'

interface ItineraryFolderPreviewProps {
  folder: ItineraryFolder
  showAuthor?: boolean
}

export function ItineraryFolderPreview(props: ItineraryFolderPreviewProps) {
  return (
    <Suspense fallback={<ItineraryFolderPreviewSkeleton />}>
      <ItineraryFolderPreviewContent {...props} />
    </Suspense>
  )
}

export function ItineraryFolderPreviewSkeleton() {
  return (
    <Card className="w-full overflow-hidden pt-0 md:w-96 md:max-w-md">
      <Skeleton className="h-44 w-full rounded-none sm:h-48" />
      <CardHeader>
        <CardTitle className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4" />
            <Skeleton className="h-5 w-40" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-14 w-full" />
      </CardContent>
      <CardFooter className="justify-end">
        <Skeleton className="h-8 w-16" />
      </CardFooter>
    </Card>
  )
}

function ItineraryFolderPreviewContent({
  folder,
  showAuthor,
}: ItineraryFolderPreviewProps) {
  const { itinerariesQuery } = useCityItineraries({ folderId: folder.id })
  const { userQuery } = useSingleUser({ userId: folder.authorId })
  const { data } = authClient.useSession()
  const router = useRouter()

  const cities = itinerariesQuery.data
  const cityCount = cities.length

  const activitiesQueries = useQueries({
    queries: cities.map((cityItinerary) => ({
      ...cityItinerarySavedActivitiesQueryOptions({
        cityItineraryId: cityItinerary.id,
      }),
      enabled: cityCount > 1,
    })),
  })

  const isPrivate = !folder.isPublic && data?.session.userId !== folder.authorId

  if (cityCount === 0 || isPrivate) return null

  if (cityCount === 1) {
    return (
      <CityItineraryPreview
        cityItinerary={cities[0]}
        showAuthor={showAuthor}
        author={userQuery.data.name}
        authorUsername={userQuery.data.username ?? undefined}
      />
    )
  }

  const thumbUrls = activitiesQueries.reduce<Array<string>>((urls, q) => {
    for (const activity of q.data ?? []) {
      if (activity.imageUrl && urls.length < 4) urls.push(activity.imageUrl)
    }
    return urls
  }, [])
  const uniqueThumbUrls = [...new Set(thumbUrls)]

  const thumbsLoading = activitiesQueries.some((q) => q.isPending)

  return (
    <Link
      to="/itineraries/$id"
      params={{ id: folder.id }}
      className="block rounded-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="w-full overflow-hidden pt-0 md:w-96 md:max-w-md">
        {thumbsLoading && uniqueThumbUrls.length === 0 ? (
          <Skeleton className="h-44 w-full rounded-none sm:h-48" />
        ) : uniqueThumbUrls.length > 0 ? (
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
                  alt={`${folder.title ?? 'Itinerary'} activity preview ${index + 1}`}
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
          <CardTitle className="flex flex-col gap-1 line-clamp-1 text-ellipsis">
            {folder.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-ellipsis">
            {folder.description}
          </CardDescription>
          <CardAction className="flex items-center gap-2">
            <Badge variant="secondary">{cityCount} cities</Badge>
            <Folder />
          </CardAction>
        </CardHeader>
        {showAuthor && (
          <CardFooter>
            <TypographyMuted>
              by{' '}
              {userQuery.data.username ? (
                <span
                  onClick={() =>
                    router.navigate({
                      to: '/profile/$username',
                      params: { username: userQuery.data.username! },
                    })
                  }
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  {userQuery.data.name}
                </span>
              ) : (
                userQuery.data.name
              )}
            </TypographyMuted>
          </CardFooter>
        )}
      </Card>
    </Link>
  )
}
