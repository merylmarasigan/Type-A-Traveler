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
import { Image } from '@unpic/react'
import { Plus } from 'lucide-react'

interface SavedActivityPreviewProps {
  id: string
  timeSlotId?: string
  cityItineraryId?: string
}

export function SavedActivityPreview({
  id,
  timeSlotId,
  cityItineraryId,
}: SavedActivityPreviewProps) {
  const { activityQuery, updateActivityMutation } = useSingleSavedActivity(
    id,
    cityItineraryId,
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
    <Card className="pt-0">
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
