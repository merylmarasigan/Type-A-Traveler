import { CityItineraryPreview } from '@/components/itineraries/city-itinerary-preview'
import { EditableItineraryTitle } from '@/components/itineraries/editable-itinerary-title'
import { SearchCitiesDialog } from '@/components/search-cities-dialog'
import { TypographyH2 } from '@/components/ui/typography'
import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/itineraries/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const { folderQuery, updateFolderMutation } = useSingleItineraryFolder(id)
  const { itinerariesQuery: cityItineraries } = useCityItineraries(id)

  const updateTitle = async (value: { title: string | null }) => {
    await updateFolderMutation.mutateAsync({
      id,
      title: value.title,
    })
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="grid grid-cols-3">
        <EditableItineraryTitle
          title={folderQuery.data?.title ?? cityItineraries.data[0].title}
          id={id}
          type="Folder"
          onSubmit={updateTitle}
        />
        <SearchCitiesDialog className="col-start-3 justify-self-end" />
      </div>
      {cityItineraries.data.length > 1 && (
        <TypographyH2 className="text-center">
          {cityItineraries.data.length} cities
        </TypographyH2>
      )}
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
