import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod/v4'
import { ChevronDown, SearchAlertIcon } from 'lucide-react'
import { LocationPreview } from '@/components/location-preview'
import { ErrorComponent } from '@/components/error'
import { TypographyH2 } from '@/components/ui/typography'
import {
  defaultLocationQueryOptions,
  locationsQueryOptions,
  singleLocationPhotoQueryOptions,
} from '@/services/tripadvisor/query-options'
import { LocationCategoryEnum } from '@/services/tripadvisor/api'
import { CreateItineraryDialog } from '@/components/itineraries/create-itinerary-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import { ItineraryFolderDropdownItem } from '@/components/itinerary-folder-dropdown-item'

const categorySearchSchema = z.object({
  category: LocationCategoryEnum.catch('hotels'),
  lat: z.string(),
  lng: z.string(),
})

export const Route = createFileRoute('/activities/$city')({
  component: RouteComponent,
  validateSearch: categorySearchSchema,
  errorComponent: (error) => (
    <ErrorComponent
      {...error}
      description="No activities found for this city."
    />
  ),
})

function RouteComponent() {
  const { city } = Route.useParams()
  const { category, lat, lng } = Route.useSearch()

  const cityLocationsQuery = useSuspenseQuery(
    locationsQueryOptions(city, category, lat, lng),
  )

  const { userFoldersQuery } = useItineraryFolders()

  const defaultLocationQuery = useSuspenseQuery(
    defaultLocationQueryOptions(city, lat, lng),
  )

  const { data: defaultCityPhoto } = useSuspenseQuery(
    singleLocationPhotoQueryOptions(
      city,
      defaultLocationQuery.data.location_id,
    ),
  )

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-7xl flex flex-col gap-2 md:gap-4 p-2">
        <div className="self-start w-full flex justify-between items-center p-2 gap-2">
          <TypographyH2 className="text-start">
            Suggested {category} for {city}
          </TypographyH2>

          <div className="flex items-center gap-2">
            {userFoldersQuery.data.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary">
                    My existing itineraries
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuGroup>
                    {userFoldersQuery.data.map((folder) => (
                      <ItineraryFolderDropdownItem
                        key={folder.id}
                        folder={folder}
                      />
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <CreateItineraryDialog city={city} lat={lat} lng={lng} />
          </div>
        </div>
        {cityLocationsQuery.data.length === 0 ? (
          <Alert>
            <SearchAlertIcon />
            <AlertTitle>No {category} found.</AlertTitle>
            <AlertDescription>Try again later</AlertDescription>
          </Alert>
        ) : (
          <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 max-w-7xl">
            {cityLocationsQuery.data.map((location) => (
              <LocationPreview
                key={location.location_id}
                city={city}
                lat={lat}
                lng={lng}
                cityPhoto={
                  defaultCityPhoto
                    ? defaultCityPhoto
                    : '../No_Image_Available.jpg'
                }
                location={location}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
