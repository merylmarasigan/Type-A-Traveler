import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TypographySmall } from '@/components/ui/typography'
import { SavedActivity } from '@/db/types'
import { Image } from '@unpic/react'

interface SavedActivityPreviewProps {
  activity: SavedActivity
}

export function SavedActivityPreview({ activity }: SavedActivityPreviewProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm max-h-fit pt-0 hover:bg-muted hover:cursor-pointer">
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
      </CardHeader>
      <CardFooter>
        <TypographySmall>{activity.city}</TypographySmall>
      </CardFooter>
    </Card>
  )
}
