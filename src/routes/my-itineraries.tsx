import { createFileRoute } from '@tanstack/react-router'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import { authClient } from '@/lib/auth-client'
import { ItineraryFolderPreview } from '@/components/itineraries/itinerary-folder-preview'

export const Route = createFileRoute('/my-itineraries')({
  component: myItinerariesPage,
})

function myItinerariesPage() {
  const { data } = authClient.useSession()
  const { userFoldersQuery } = useItineraryFolders(data?.user?.id)
  const { data: folders } = userFoldersQuery

  return (
    <div>
      <h1 className="ml-5 mb-3 mt-5 text-7xl font-bold">My Itineraries</h1>
      <h2 className="ml-5 mb-10">
        Where your past, present, and future trip plans live!
      </h2>
      <div className="grid grid-cols-3 gap-5 m-5">
        {folders.map((folder) => (
          <ItineraryFolderPreview key={folder.id} folder={folder} />
        ))}
      </div>
    </div>
  )
}
