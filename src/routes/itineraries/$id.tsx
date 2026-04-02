import { CityItineraryDetails } from '@/components/itineraries/city-itinerary-details'
import { CityItineraryPreview } from '@/components/itineraries/city-itinerary-preview'
import { EditableItineraryTitle } from '@/components/itineraries/editable-itinerary-title'
import { SearchCitiesDialog } from '@/components/search-cities-dialog'
import { TypographyH2, TypographySmall } from '@/components/ui/typography'
import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { useSingleUser } from '@/hooks/use-single-user'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/itineraries/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { folderQuery, updateFolderMutation } = useSingleItineraryFolder(id)
  const { itinerariesQuery: cityItineraries } = useCityItineraries(id)
  const { data } = authClient.useSession()
  const { userQuery } = useSingleUser(folderQuery.data.authorId)

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

  const title = folderQuery.data?.title ?? cityItineraries.data[0].title
  const description =
    folderQuery.data.description ?? cityItineraries.data[0].description
  const authorIsSessionUser = data?.user.id === folderQuery.data.authorId

  const folderOnlyHasOneCity = cityItineraries.data.length === 1

  return (
    <div className="flex flex-col gap-2 p-2">
      {authorIsSessionUser ? (
        <EditableItineraryTitle
          title={title}
          description={description}
          id={id}
          type="Folder"
          onSubmit={updateTitle}
        />
      ) : (
        <p
          className={cn(
            'h-min w-full col-start-1 col-span-2 md:col-start-2 md:col-span-1',
            'flex flex-wrap justify-between items-center',
            'line-clamp-2text-center text-3xl md:text-4xl font-extrabold',
          )}
        >
          {title}
        </p>
      )}

      {cityItineraries.data.length > 1 && (
        <TypographyH2>{cityItineraries.data.length} cities</TypographyH2>
      )}
      <TypographySmall>by {userQuery.data.name}</TypographySmall>

      <SearchCitiesDialog className="self-start" />

      {folderOnlyHasOneCity ? (
        <div className="flex flex-col h-full gap-2 p-2">
          <CityItineraryDetails id={cityItineraries.data[0].id} />
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 self-center">
          {cityItineraries.data.map((cityItinerary) => (
            <CityItineraryPreview
              key={cityItinerary.id}
              cityItinerary={cityItinerary}
            />
          ))}
        </div>
      )}
    </div>
  )
}
