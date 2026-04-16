import { Suspense } from 'react'
import { Image } from '@unpic/react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TypographySmall } from '@/components/ui/typography'
import { useSingleSavedActivity } from '@/hooks/use-single-saved-activity'
import { authClient } from '@/lib/auth-client'

interface SavedActivityPreviewProps {
  id: string
  timeSlotId?: string
  cityItineraryId?: string
  city?: string
}

export function SavedActivityPreview(props: SavedActivityPreviewProps) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <SavedActivityPreviewContent {...props} />
    </Suspense>
  )
}

function SavedActivityPreviewContent({
  id,
  timeSlotId,
  cityItineraryId,
  city,
}: SavedActivityPreviewProps) {
  const { data } = authClient.useSession()

  const { activityQuery, updateActivityMutation } = useSingleSavedActivity(
    id,
    cityItineraryId,
    data?.user.id,
    city,
  )

  const addToTimeSlot = async () => {
    if (!timeSlotId) return

    await updateActivityMutation.mutateAsync({
      id,
      timeSlotId,
    })
  }

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
          className="relative aspect-video w-full object-cover dark:brightness-40 rounded-t-md"
        />
      )}
      <CardHeader>
        <CardTitle>{activity.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {activity.description}
        </CardDescription>
        {timeSlotId && (
          <CardAction>
            <Button onClick={addToTimeSlot}>
              <Plus />
              Add
            </Button>
          </CardAction>
        )}
      </CardHeader>
      {!timeSlotId && (
        <CardFooter>
          <TypographySmall>{activity.city}</TypographySmall>
        </CardFooter>
      )}
    </Card>
  )
}
