import { Suspense } from 'react'
import { Image } from '@unpic/react'
import { X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
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
import { unlinkActivityFromTimeSlotMutationOptions } from '@/services/backend/saved-activities.options'
import { authClient } from '@/lib/auth-client'

interface TimeSlotActivityCardProps {
  id: string
  timeSlotId: string
  cityItineraryId: string
  city: string
}

export function TimeSlotActivityCard(props: TimeSlotActivityCardProps) {
  return (
    <Suspense fallback={<TimeSlotActivityCardSkeleton />}>
      <TimeSlotActivityCardContent {...props} />
    </Suspense>
  )
}

export function TimeSlotActivityCardSkeleton() {
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

function TimeSlotActivityCardContent({
  id,
  timeSlotId,
  cityItineraryId,
  city,
}: TimeSlotActivityCardProps) {
  const { data: session } = authClient.useSession()

  const { activityQuery } = useSingleSavedActivity({ savedActivityId: id })

  const unlinkMutation = useMutation(
    unlinkActivityFromTimeSlotMutationOptions(
      timeSlotId,
      cityItineraryId,
      session?.user.id ?? '',
      city,
    ),
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
            variant="ghost"
            size="icon"
            onClick={() => unlinkMutation.mutate(id)}
            disabled={unlinkMutation.isPending}
          >
            <X />
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  )
}
