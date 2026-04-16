import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Folder } from 'lucide-react'
import { Suspense } from 'react'
import {
  CityItineraryDetails,
  CityItineraryDetailsSkeleton,
} from '@/components/itineraries/city-itinerary-details'
import { CityItineraryPreview } from '@/components/itineraries/city-itinerary-preview'
import { EditItineraryDialog } from '@/components/itineraries/edit-itinerary-dialog'
import { ItineraryFolderOverview } from '@/components/itineraries/itinerary-folder-overview'
import { SearchCitiesDialog } from '@/components/cities-locations/search-cities-dialog'
import {
  TypographyBlockquote,
  TypographyH1,
  TypographyH2,
  TypographySmall,
} from '@/components/ui/typography'
import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { useSingleUser } from '@/hooks/use-single-user'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/itineraries/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-2 p-2">
          <CityItineraryDetailsSkeleton />
        </div>
      }
    >
      <RouteContent id={id} />
    </Suspense>
  )
}

function RouteContent({ id }: { id: string }) {
  const { folderQuery, updateFolderMutation, deleteFolderMutation } =
    useSingleItineraryFolder(id)
  const { itinerariesQuery: cityItineraries } = useCityItineraries(id)
  const { data } = authClient.useSession()
  const { userQuery } = useSingleUser(folderQuery.data.authorId)
  const router = useRouter()

  const updateTitle = async (value: {
    title: string | null
    description: string | null
  }) => {
    await updateFolderMutation.mutateAsync({
      id,
      title: value.title,
      description: value.description,
    })
  }

  const deleteFolder = async () => {
    await deleteFolderMutation.mutateAsync(id)
    await router.navigate({ to: '/my-itineraries' })
  }

  const title = folderQuery.data?.title ?? cityItineraries.data[0]?.title
  const description =
    folderQuery.data?.description ?? cityItineraries.data[0]?.description
  const authorIsSessionUser = data?.user.id === folderQuery.data.authorId

  const folderOnlyHasOneCity = cityItineraries.data.length === 1

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="self-center flex gap-2 items-center justify-between">
        <Folder />
        <TypographyH1>{title}</TypographyH1>
      </div>
      {description && (
        <TypographyBlockquote className="text-center">
          {description}
        </TypographyBlockquote>
      )}
      <TypographySmall className="text-center">
        by {userQuery.data.name}
      </TypographySmall>
      {cityItineraries.data.length > 1 && (
        <TypographySmall className="self-center text-center text-muted-foreground">
          {cityItineraries.data.length} cities
        </TypographySmall>
      )}

      {authorIsSessionUser && (
        <div className="self-center flex justify-between items-center gap-2 w-min">
          <EditItineraryDialog
            title={title}
            description={description}
            id={id}
            type="Folder"
            onSubmit={updateTitle}
            onDelete={deleteFolder}
          />
          <SearchCitiesDialog className="self-start" />
        </div>
      )}

      <ItineraryFolderOverview folder={folderQuery.data} />

      {folderOnlyHasOneCity ? (
        <div className="flex flex-col h-full gap-2 p-2">
          <CityItineraryDetails id={cityItineraries.data[0].id} />
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <TypographyH2 className="w-full">Cities</TypographyH2>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 self-center">
            {cityItineraries.data.map((cityItinerary) => (
              <CityItineraryPreview
                key={cityItinerary.id}
                cityItinerary={cityItinerary}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
