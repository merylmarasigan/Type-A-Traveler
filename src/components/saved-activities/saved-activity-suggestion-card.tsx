import { Suspense } from 'react'
import { Image } from '@unpic/react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useSingleSavedActivity } from '@/hooks/use-single-saved-activity'
import { useMutation } from '@tanstack/react-query'
import { linkActivityToTimeSlotMutationOptions } from '@/services/backend/saved-activities.options'
import { authClient } from '@/lib/auth-client'

interface SavedActivitySuggestionCardProps {
  id: string
  timeSlotId: string
  cityItineraryId: string
  city: string
}

export function SavedActivitySuggestionCard(
  props: SavedActivitySuggestionCardProps,
) {
  return (
    <Suspense fallback={<SavedActivitySuggestionCardSkeleton />}>
      <SavedActivitySuggestionCardContent {...props} />
    </Suspense>
  )
}

export function SavedActivitySuggestionCardSkeleton() {
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

function SavedActivitySuggestionCardContent({
  id,
  timeSlotId,
  cityItineraryId,
  city,
}: SavedActivitySuggestionCardProps) {
  const { data: session } = authClient.useSession()

  const { activityQuery } = useSingleSavedActivity({ savedActivityId: id })

  const linkMutation = useMutation(
    linkActivityToTimeSlotMutationOptions({
      timeSlotId,
      cityItineraryId,
      userId: session?.user.id ?? '',
      city,
    }),
  )

  const activity = activityQuery.data

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
            onClick={() => linkMutation.mutate(id)}
            disabled={linkMutation.isPending}
          >
            <Plus />
            Add
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
