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

  const updateTitle = async (value: { title: string | null }) => {
    await updateFolderMutation.mutateAsync({
      id,
      title: value.title,
    })
  }

  const title = folderQuery.data?.title ?? cityItineraries.data[0].title
  const authorIsSessionUser = data?.user.id === folderQuery.data.authorId

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="grid grid-cols-3">
        {authorIsSessionUser ? (
          <>
            <EditableItineraryTitle
              title={title}
              id={id}
              type="Folder"
              onSubmit={updateTitle}
            />
            <SearchCitiesDialog className="col-start-3 justify-self-end" />
          </>
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
      </div>

      {cityItineraries.data.length > 1 && (
        <TypographyH2 className="text-center">
          {cityItineraries.data.length} cities
        </TypographyH2>
      )}
      <TypographySmall className="text-center">
        by {userQuery.data.name}
      </TypographySmall>

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 self-center">
        {cityItineraries.data.map((cityItinerary) => (
          <CityItineraryPreview
            key={cityItinerary.id}
            cityItinerary={cityItinerary}
          />
        ))}
      </div>
    </div>
  )
}
