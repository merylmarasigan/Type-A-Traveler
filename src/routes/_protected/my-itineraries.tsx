import { Link, createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { FolderClosed, FolderPlus } from 'lucide-react'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import {
  ItineraryFolderPreview,
  ItineraryFolderPreviewSkeleton,
} from '@/components/itineraries/itinerary-folder-preview'
import { TypographyH1, TypographySmall } from '@/components/ui/typography'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_protected/my-itineraries')({
  component: myItinerariesPage,
})

function myItinerariesPage() {
  return (
    <div className="flex flex-col h-full gap-2 p-2">
      <TypographyH1 className="text-start">My Itineraries</TypographyH1>
      <TypographySmall>
        Where your past, present, and future trip plans live!
      </TypographySmall>
      <Suspense
        fallback={
          <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <ItineraryFolderPreviewSkeleton key={i} />
            ))}
          </div>
        }
      >
        <MyItinerariesPageContent />
      </Suspense>
    </div>
  )
}

function MyItinerariesPageContent() {
  const { userFoldersQuery } = useItineraryFolders()
  const { data: folders } = userFoldersQuery

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
      {folders.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderClosed />
            </EmptyMedia>
            <EmptyTitle>No Itineraries Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any itineraries yet. Get started by
              creating your first itinerary.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row justify-center gap-2">
            <Button asChild>
              <Link to="/">
                <FolderPlus />
                Create Itinerary
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      ) : (
        folders.map((folder) => (
          <ItineraryFolderPreview key={folder.id} folder={folder} />
        ))
      )}
    </div>
  )
}
