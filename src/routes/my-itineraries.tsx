import { createFileRoute } from '@tanstack/react-router'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import { authClient } from '@/lib/auth-client'
import { ItineraryFolderPreview } from '@/components/itineraries/itinerary-folder-preview'
import { TypographyH1, TypographySmall } from '@/components/ui/typography'

export const Route = createFileRoute('/my-itineraries')({
  component: myItinerariesPage,
})

function myItinerariesPage() {
  const { data } = authClient.useSession()
  const { userFoldersQuery } = useItineraryFolders(data?.user?.id)
  const { data: folders } = userFoldersQuery

  return (
    <div className="flex flex-col h-full gap-2 p-2">
      <TypographyH1 className="text-start">My Itineraries</TypographyH1>
      <TypographySmall>
        Where your past, present, and future trip plans live!
      </TypographySmall>
      <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4">
        {folders.map((folder) => (
          <ItineraryFolderPreview key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  )
}
