import {
  ItineraryFolderPreview,
  ItineraryFolderPreviewSkeleton,
} from '@/components/itineraries/itinerary-folder-preview'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { TypographyH3 } from '@/components/ui/typography'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import { Suspense } from 'react'

export function FeaturedItineraries() {
  return (
    <div className="w-min flex min-w-0 max-w-full flex-col gap-2 p-2">
      <TypographyH3>Featured Itineraries</TypographyH3>
      <Suspense
        fallback={
          <div className="self-center mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ItineraryFolderPreviewSkeleton key={i} />
            ))}
          </div>
        }
      >
        <FeaturedItinerariesContent />
      </Suspense>
    </div>
  )
}

function FeaturedItinerariesContent() {
  const { foldersQuery } = useItineraryFolders(20)
  const { data: folders } = foldersQuery

  return (
    <ScrollArea className="self-center w-full min-w-0 max-w-full px-2 rounded-md border whitespace-nowrap md:max-w-5xl">
      <div className="flex w-max space-x-4 p-4">
        {folders.map((folder) => (
          <ItineraryFolderPreview key={folder.id} folder={folder} />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
