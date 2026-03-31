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
import { SavedActivity } from '@/db/types'
import { Image } from '@unpic/react'
import { Plus } from 'lucide-react'

interface SavedActivityPreviewProps {
  activity: SavedActivity
  addToTimeSlot?: () => Promise<void>
}

export function SavedActivityPreview({
  activity,
  addToTimeSlot,
}: SavedActivityPreviewProps) {
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
        {addToTimeSlot && (
          <CardAction>
            <Button>
              <Plus />
              Add
            </Button>
          </CardAction>
        )}
      </CardHeader>
      {!addToTimeSlot && (
        <CardFooter>
          <TypographySmall>{activity.city}</TypographySmall>
        </CardFooter>
      )}
    </Card>
  )
}
