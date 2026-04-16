import { Suspense } from 'react'
import { Link } from '@tanstack/react-router'
import { Eye, Folder, MapPin } from 'lucide-react'
import type { ItineraryFolder } from '@/db/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  TypographyBlockquote,
  TypographyMuted,
} from '@/components/ui/typography'
import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { useSingleUser } from '@/hooks/use-single-user'
import { cn } from '@/lib/utils'

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
    <Card className="w-full md:w-96 md:max-w-md">
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

  const cityCount = itinerariesQuery.data.length
  const multipleCities = itinerariesQuery.data.length > 1
  const firstCity = itinerariesQuery.data[0]

  if (!firstCity && !multipleCities) return null

  return (
    <Card className="w-full md:w-96 md:max-w-md">
      <CardHeader>
        <CardTitle className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {multipleCities ? <Folder /> : <MapPin />}
            {multipleCities ? folder.title : firstCity.title}
          </div>
          {showAuthor && (
            <TypographyMuted>by {userQuery.data.name}</TypographyMuted>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TypographyBlockquote className="line-clamp-2 text-wrap text-ellipsis overflow-hidden">
          {multipleCities ? folder.description : firstCity.description}
        </TypographyBlockquote>
      </CardContent>
      <CardFooter
        className={cn(multipleCities ? 'justify-between' : 'justify-end')}
      >
        {multipleCities && (
          <Badge variant="secondary">{cityCount} cities</Badge>
        )}
        <Button asChild size="sm">
          <Link to="/itineraries/$id" params={{ id: folder.id }}>
            <Eye />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
