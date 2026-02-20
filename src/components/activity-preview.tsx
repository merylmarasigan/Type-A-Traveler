import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FsqPlace } from '@/services/foursquare/schema'
import { Bookmark, Eye } from 'lucide-react'

interface ActivityPreviewProps {
  activity: FsqPlace
}

export function ActivityPreview({ activity }: ActivityPreviewProps) {
  return (
    <Card className="relative mx-auto w-full max-w-sm hover:cursor-pointer">
      <CardHeader>
        <CardTitle>{activity.name}</CardTitle>
        <CardDescription>{activity.location?.locality}</CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">
          <Eye />
          View
        </Button>
        <Button className="w-full" variant="secondary">
          <Bookmark />
          Save
        </Button>
      </CardFooter>
    </Card>
  )
}
