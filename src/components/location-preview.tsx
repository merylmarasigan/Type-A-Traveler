import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { TypographyMuted } from '@/components/ui/typography'
import {
  singleLocationPhotoQueryOptions,
  singleLocationQueryOptions,
} from '@/services/tripadvisor/query-options'
import { Location, LocationDetails } from '@/services/tripadvisor/schema'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Bookmark, Eye } from 'lucide-react'
import { ComponentProps } from 'react'
import { HoverCard as HoverCardPrimitive } from 'radix-ui'
import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'

interface LocationPreviewHoverProps extends ComponentProps<
  typeof HoverCardPrimitive.Root
> {
  details: LocationDetails
}

function LocationPreviewHover({
  details,
  children,
}: LocationPreviewHoverProps) {
  return (
    <HoverCard>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="flex w-64 flex-col gap-0.5">
        <div className="font-semibold">{details.name}</div>
        <div>{details.description}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          <Link to={details.website} target="_blank" rel="noopener noreferrer">
            {details.website}
          </Link>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

interface LocationPreviewProps {
  city: string
  location: Location
}

export function LocationPreview({ city, location }: LocationPreviewProps) {
  const { data: details } = useSuspenseQuery(
    singleLocationQueryOptions(city, location.location_id),
  )

  const { data: photo } = useSuspenseQuery(
    singleLocationPhotoQueryOptions(city, location.location_id),
  )

  return (
    <LocationPreviewHover details={details}>
      <Card className="relative mx-auto w-full max-w-sm max-h-fit pt-0 hover:bg-muted hover:cursor-pointer">
        <Image
          src={photo}
          layout="constrained"
          width={384}
          height={192}
          alt={location.name}
          className="relative aspect-video w-full object-cover dark:brightness-40 rounded-t-md"
        />
        <CardHeader>
          <CardTitle>{location.name}</CardTitle>
          <CardDescription>
            {details.cuisine?.map((c) => c.name).join(', ')}
          </CardDescription>
        </CardHeader>
        <CardContent className="line-clamp-3">
          <TypographyMuted>{details.description}</TypographyMuted>
        </CardContent>
        <CardFooter className="gap-2 justify-between">
          <Button asChild className="flex-1 hover:cursor-pointer">
            <Link
              to={details.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye />
              View
            </Link>
          </Button>
          <Button className="flex-1 hover:cursor-pointer" variant="secondary">
            <Bookmark />
            Save
          </Button>
        </CardFooter>
      </Card>
    </LocationPreviewHover>
  )
}
