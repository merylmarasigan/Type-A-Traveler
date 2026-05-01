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
          <div className="relative self-center w-full min-w-0 max-w-full md:max-w-5xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 rounded-l-md bg-linear-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 rounded-r-md bg-linear-to-l from-background to-transparent" />
            <ScrollArea className="w-full rounded-md border whitespace-nowrap">
              <div className="flex w-max space-x-4 p-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ItineraryFolderPreviewSkeleton key={i} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        }
      >
        <FeaturedItinerariesContent />
      </Suspense>
    </div>
  )
}

function FeaturedItinerariesContent() {
  const { foldersQuery } = useItineraryFolders({ limit: 50, publicOnly: true })
  const { data: folders } = foldersQuery

  return (
    <div className="relative self-center w-full min-w-0 max-w-full md:max-w-5xl">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 rounded-l-md bg-linear-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 rounded-r-md bg-linear-to-l from-background to-transparent" />
      <ScrollArea className="w-full rounded-md border whitespace-nowrap">
        <div className="flex w-max space-x-4 p-4">
          {folders.map((folder) => (
            <ItineraryFolderPreview key={folder.id} folder={folder} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
