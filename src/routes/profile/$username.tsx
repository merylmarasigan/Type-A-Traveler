import { TypographyH1, TypographyMuted } from '@/components/ui/typography'
import { NotFound } from '@/components/util/not-found'
import { useSingleUser } from '@/hooks/use-single-user'
import { getUserIdByUsernameFn } from '@/services/backend/users.api'
import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { Suspense } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { FolderClosed, FolderPlus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ActivitiesByCity } from '@/components/saved-activities/activities-by-city'
import {
  ItineraryFolderPreview,
  ItineraryFolderPreviewSkeleton,
} from '@/components/itineraries/itinerary-folder-preview'
import { userItineraryFoldersQueryOptions } from '@/services/backend/itinerary-folders.options'
import { SavedActivityCardSkeleton } from '@/components/saved-activities/saved-activity-card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/profile/$username')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const userId = await getUserIdByUsernameFn({
      data: { username: params.username },
    })
    if (!userId) throw notFound()

    return { userId }
  },
  notFoundComponent: () => <NotFound type="user" />,
})

function RouteComponent() {
  const { userId } = Route.useLoaderData()

  return (
    <Suspense fallback={<ProfilePageSkeleton />}>
      <RouteContent userId={userId} />
    </Suspense>
  )
}

function ProfilePageSkeleton() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 md:p-6">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-9 w-full max-w-md" />
      <div className="mt-2 flex flex-col flex-wrap gap-4 sm:flex-row">
        {Array.from({ length: 2 }).map((_, i) => (
          <ItineraryFolderPreviewSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

function RouteContent({ userId }: { userId: string }) {
  const { userQuery } = useSingleUser({ userId })
  const { data: session } = authClient.useSession()

  const isOwner = session?.user.id === userId

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <TypographyH1>{userQuery.data.name}</TypographyH1>
        <TypographyMuted className="text-center">
          @{userQuery.data.username}
        </TypographyMuted>
      </div>

      <Tabs defaultValue="itineraries" className="flex flex-col gap-4">
        <TabsList variant="line" className="w-full">
          <TabsTrigger value="itineraries">Itineraries</TabsTrigger>
          <TabsTrigger value="saved-activities">Saved activities</TabsTrigger>
        </TabsList>
        <TabsContent value="itineraries" className="flex flex-col gap-4">
          <Suspense
            fallback={
              <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ItineraryFolderPreviewSkeleton key={i} />
                ))}
              </div>
            }
          >
            <ProfileItinerariesTab userId={userId} isOwner={isOwner} />
          </Suspense>
        </TabsContent>
        <TabsContent value="saved-activities" className="flex flex-col gap-4">
          <Suspense
            fallback={
              <div className="flex flex-col gap-10">
                {Array.from({ length: 2 }).map((_, i) => (
                  <section key={i}>
                    <Skeleton className="mb-4 h-7 w-32" />
                    <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {Array.from({ length: 4 }).map((_, j) => (
                        <SavedActivityCardSkeleton key={j} />
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            }
          >
            <ActivitiesByCity
              forUserId={userId}
              showCreateItinerary={false}
              emptyTitle="No saved activities"
              emptyDescription={`${isOwner ? 'You have' : 'This user has'} not saved any activities yet.`}
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProfileItinerariesTab({
  userId,
  isOwner,
}: {
  userId: string
  isOwner: boolean
}) {
  const { data: folders } = useSuspenseQuery(
    userItineraryFoldersQueryOptions({ userId }),
  )

  if (folders.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderClosed />
          </EmptyMedia>
          <EmptyTitle>No itineraries yet</EmptyTitle>
          <EmptyDescription>
            {isOwner ? 'You have' : 'This user has'} not created any itineraries
            yet.
          </EmptyDescription>
        </EmptyHeader>
        {isOwner && (
          <EmptyContent className="flex-row justify-center gap-2">
            <Button asChild>
              <Link to="/">
                <FolderPlus />
                Plan a trip
              </Link>
            </Button>
          </EmptyContent>
        )}
      </Empty>
    )
  }

  return (
    <div className="flex flex-col flex-wrap gap-4 sm:flex-row">
      {folders.map((folder) => (
        <ItineraryFolderPreview key={folder.id} folder={folder} />
      ))}
    </div>
  )
}
