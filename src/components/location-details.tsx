import { Link } from '@tanstack/react-router'
import { Eye, SquareArrowOutUpRight } from 'lucide-react'
import type { LocationDetails } from '@/services/tripadvisor/schema'
import { SaveActivityButton } from '@/components/saved-activities/save-activity-button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface LocationDetailsProps {
  city: string
  lat: string
  lng: string
  details: LocationDetails
  imageUrl: string
}

export function LocationDetailsDialog({
  city,
  lat,
  lng,
  details,
  imageUrl,
}: LocationDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="secondary" className="flex-1">
            <Eye />
            View
          </Button>
        }
      />
      <DialogContent>
        <img
          src={imageUrl}
          alt={details.name}
          className="mt-4 relative aspect-video w-full object-cover dark:brightness-40 rounded-t-md"
        />
        <DialogHeader>
          <DialogTitle>{details.name}</DialogTitle>
          <DialogDescription>
            {details.address_obj?.city}, {details.address_obj?.state}
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          {details.description}
        </div>
        <DialogFooter className="gap-2 justify-between">
          <Button variant="link" className="flex-1">
            <Link target="_blank" to={details.web_url}>
              See more on TripAdvisor.com
            </Link>
            <SquareArrowOutUpRight />
          </Button>
          <SaveActivityButton
            activity={details}
            city={city}
            lat={lat}
            lng={lng}
            imageUrl={imageUrl}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
