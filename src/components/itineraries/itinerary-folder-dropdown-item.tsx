import { Suspense } from 'react'
import { Link } from '@tanstack/react-router'
import { MapPin } from 'lucide-react'
import type { ItineraryFolder } from '@/db/types'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useCityItineraries } from '@/hooks/use-city-itineraries'

interface ItineraryFolderDropdownItemProps {
  folder: ItineraryFolder
}

export function ItineraryFolderDropdownItem(
  props: ItineraryFolderDropdownItemProps,
) {
  return (
    <Suspense fallback={null}>
      <ItineraryFolderDropdownItemContent {...props} />
    </Suspense>
  )
}

function ItineraryFolderDropdownItemContent({
  folder,
}: ItineraryFolderDropdownItemProps) {
  const { itinerariesQuery } = useCityItineraries({ folderId: folder.id })

  return itinerariesQuery.data.map((itinerary) => (
    <DropdownMenuItem key={itinerary.id}>
      <MapPin />
      <Link
        to="/itineraries/cities/$cityId"
        params={{ cityId: itinerary.id }}
        className="underline"
      >
        {itinerary.title}
      </Link>
    </DropdownMenuItem>
  ))
}
