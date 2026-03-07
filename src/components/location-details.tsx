import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { singleLocationPhotoQueryOptions, singleLocationQueryOptions } from '@/services/tripadvisor/query-options'
import { Location } from '@/services/tripadvisor/schema'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Bookmark, Eye, SquareArrowOutUpRight } from 'lucide-react'

interface LocationDetailsProps {
  city: string
  location: Location,
  photo: string
}

export function LocationDetails({ city, location, photo }: LocationDetailsProps) {
  
  const { data: details } = useSuspenseQuery(
    singleLocationQueryOptions(city, location.location_id),
  )

    return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Eye />
          View
        </Button>
      </DialogTrigger>
      <DialogContent>
        <img
          src={photo}
          alt={location.name}
          className="relative aspect-video w-full object-cover   dark:brightness-40 rounded-t-md"
        />
        <DialogHeader>
          <DialogTitle>{location.name}</DialogTitle>
          <DialogDescription>
            {details.address_obj?.city}, {details.address_obj?.state}
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          {details.description}
        </div>
        <DialogFooter className="sm:flex-col flex">
          <a target="_blank" href={details.web_url} className="flex gap-x-2 items-center">
            <Button className="w-full hover:cursor-pointer" variant="default">
              
                See More on TripAdvisor.com
                <SquareArrowOutUpRight />
              
            </Button>
          </a>
          <Button className="w-full" variant="secondary">
            <Bookmark />
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}