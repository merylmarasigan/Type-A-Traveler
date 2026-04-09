import { createFileRoute } from '@tanstack/react-router'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import { ItineraryFolderPreview } from '@/components/itineraries/itinerary-folder-preview'
import { TypographyH1, TypographySmall } from '@/components/ui/typography'

export const Route = createFileRoute('/community')({
  component: CommunityPage,
})

function CommunityPage() {
  const { foldersQuery } = useItineraryFolders()
  const { data: folders } = foldersQuery

  return (
    <div className="flex flex-col h-full gap-2 p-2">
      <TypographyH1 className="text-start">Community</TypographyH1>
      <TypographySmall>See trips others have planned!</TypographySmall>
      <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
        {folders.map((folder) => (
          <ItineraryFolderPreview folder={folder} showAuthor />
        ))}
      </div>
    </div>
  )
}
