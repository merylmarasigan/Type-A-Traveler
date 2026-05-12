import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod/v4'
import { ChevronDown, SearchAlertIcon } from 'lucide-react'
import { ErrorBoundary } from 'react-error-boundary'
import { Suspense } from 'react'
import type { LocationCategory } from '@/services/tripadvisor'
import { ErrorComponent } from '@/components/util/error'
import { TypographyH2 } from '@/components/ui/typography'
import {
  defaultLocationQueryOptions,
  locationsQueryOptions,
  singleLocationPhotoQueryOptions,
} from '@/services/tripadvisor/query-options'
import { LocationCategoryEnum } from '@/services/tripadvisor'
import { CreateItineraryDialog } from '@/components/itineraries/create-itinerary-dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import { ItineraryFolderDropdownItem } from '@/components/itineraries/itinerary-folder-dropdown-item'
import { FilterButtons } from '@/components/cities-locations/filter-buttons'
import {
  LocationPreview,
  LocationPreviewSkeleton,
} from '@/components/cities-locations/location-preview'

const categorySearchSchema = z.object({
  category: LocationCategoryEnum.catch('hotels'),
  lat: z.string(),
  lng: z.string(),
})

export const Route = createFileRoute('/activities/$city')({
  component: RouteComponent,
  validateSearch: categorySearchSchema,
  errorComponent: (error) => (
    <ErrorComponent {...error} description="No locations found for this city" />
  ),
})

function RouteComponent() {
  const { city } = Route.useParams()
  const { category, lat, lng } = Route.useSearch()
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center">
          <div className="max-w-7xl flex flex-col gap-2 p-2 w-full">
            <div className="self-start w-full flex justify-between items-center p-2 gap-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-9 w-40" />
            </div>
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-20" />
              ))}
            </div>
            <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4 max-w-7xl">
              {Array.from({ length: 8 }).map((_, i) => (
                <LocationPreviewSkeleton key={i} />
              ))}
            </ul>
          </div>
        </div>
      }
    >
      <RouteContent city={city} category={category} lat={lat} lng={lng} />
    </Suspense>
  )
}

function RouteContent({
  city,
  category,
  lat,
  lng,
}: {
  city: string
  category: LocationCategory
  lat: string
  lng: string
}) {
  const navigate = Route.useNavigate()

  const cityLocationsQuery = useSuspenseQuery(
    locationsQueryOptions({ city, category, lat, lng }),
  )

  const { userFoldersQuery } = useItineraryFolders({})

  const defaultLocationQuery = useSuspenseQuery(
    defaultLocationQueryOptions({ city, lat, lng }),
  )

  const { data: defaultCityPhoto } = useSuspenseQuery(
    singleLocationPhotoQueryOptions({
      city,
      locationId: defaultLocationQuery.data.location_id,
    }),
  )

  const updateCategory = (newCategory: LocationCategory) => {
    navigate({
      search: { category: newCategory, lat, lng },
    })
  }

  return (
    <div className="flex flex-col items-center">
      <div className="max-w-7xl flex flex-col gap-2 p-2">
        <div className="self-start w-full flex flex-col md:flex-row justify-between items-center p-2 gap-2">
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

        <div className="px-4 md:px-0">
          <FilterButtons
            currentCategory={category}
            setCurrentCategory={updateCategory}
          />
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
              <ErrorBoundary
                key={location.location_id}
                fallback={<div>something went wrong with {location.name}</div>}
                onError={(error) => {
                  console.error({ location, error, defaultCityPhoto })
                }}
              >
                <LocationPreview
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
              </ErrorBoundary>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
