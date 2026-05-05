import { Suspense } from 'react'
import { Image } from '@unpic/react'
import { MapPinX } from 'lucide-react'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSingleSavedActivity } from '@/hooks/use-single-saved-activity'
import { Button } from '@/components/ui/button'

interface SavedActivityCardProps {
  id: string
  cityItineraryId?: string
  userId?: string
  city?: string
}

export function SavedActivityCard(props: SavedActivityCardProps) {
  return (
    <Suspense fallback={<SavedActivityCardSkeleton />}>
      <SavedActivityCardContent {...props} />
    </Suspense>
  )
}

export function SavedActivityCardSkeleton() {
  return (
    <Card className="pt-0 max-w-sm">
      <Skeleton className="aspect-video w-full rounded-t-md rounded-b-none" />
      <CardHeader>
        <Skeleton className="h-5 w-1/2" />
        <CardDescription>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-3/4" />
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

function SavedActivityCardContent({
  id,
  cityItineraryId,
  userId,
  city,
}: SavedActivityCardProps) {
  const { activityQuery, deleteActivityMutation } = useSingleSavedActivity({
    savedActivityId: id,
    cityItineraryId,
    userId,
    city,
  })

  const activity = activityQuery.data

  const deleteActivity = async () => {
    await deleteActivityMutation.mutateAsync(id)
  }

  return (
    <Card className="pt-0 max-w-sm">
      {activity.imageUrl && (
        <Image
          src={activity.imageUrl}
          alt={activity.name}
          layout="constrained"
          width={384}
          height={192}
          className="relative aspect-video w-full object-cover rounded-t-md"
        />
      )}
      <CardHeader>
        <CardTitle>{activity.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {activity.description}
        </CardDescription>
        <CardAction>
          <Button
            disabled={deleteActivityMutation.isPending}
            onClick={deleteActivity}
            variant="ghost"
            size="icon"
          >
            <MapPinX />
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
