import { useRouter } from '@tanstack/react-router'
import { addDays } from 'date-fns'
import { Suspense, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  CalendarCheck2,
  CalendarPlus,
  ChevronDown,
  MapPin,
} from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import type { ItineraryFolder } from '@/db/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { DateRangePicker } from '@/components/itineraries/date-range-picker'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
import { Spinner } from '@/components/ui/spinner'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { useQuery } from '@tanstack/react-query'
import { folderCityItinerariesQueryOptions } from '@/services/backend/city-itineraries.options'

interface QuickCreateItineraryDialogProps {
  defaultCity?: string
  trigger?: React.ReactElement
}

export function QuickCreateItineraryDialog(
  props: QuickCreateItineraryDialogProps,
) {
  return (
    <Suspense
      fallback={
        props.trigger ?? (
          <Button disabled variant="outline" size="sm">
            <Spinner />
          </Button>
        )
      }
    >
      <QuickCreateItineraryDialogContent {...props} />
    </Suspense>
  )
}

function QuickCreateItineraryDialogContent({
  defaultCity,
  trigger,
}: QuickCreateItineraryDialogProps) {
  const { userActivitiesQuery } = useSavedActivities({})
  const { userFoldersQuery } = useItineraryFolders({ limit: 50 })
  const { createInitialDays, createIsPending } = useItineraryDays({})
  const router = useRouter()

  const cityMap = userActivitiesQuery.data.reduce<
    Record<string, { lat: string; lng: string }>
  >((acc, activity) => {
    if (!acc[activity.city]) {
      acc[activity.city] = { lat: activity.lat, lng: activity.lng }
    }
    return acc
  }, {})

  const cities = Object.keys(cityMap).sort()
  const initialCity =
    defaultCity && cityMap[defaultCity] ? defaultCity : (cities[0] ?? '')

  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 14),
  })
  const [selectedItinerary, setSelectedItinerary] =
    useState<ItineraryFolder | null>(null)

  const { data: folderCityItineraries } = useQuery(
    folderCityItinerariesQueryOptions({ folderId: selectedItinerary?.id }),
  )

  const conflictingCityItinerary =
    selectedItinerary && folderCityItineraries
      ? (folderCityItineraries.find((ci) => ci.city === selectedCity) ?? null)
      : null

  const noCities = cities.length === 0
  const userHasNoItineraries = userFoldersQuery.data.length === 0
  const coords = selectedCity ? cityMap[selectedCity] : null

  const handleConfirmDates = async () => {
    if (!coords) return

    const { itineraryFolderId } = await createInitialDays(
      dateRange,
      selectedCity,
      coords.lat,
      coords.lng,
      selectedItinerary?.id,
    )

    await router.navigate({
      to: '/itineraries/$id',
      params: { id: itineraryFolderId },
    })
  }

  const handleSelectItinerary = (id: string) => {
    const folder = userFoldersQuery.data.find((f) => f.id === id) ?? null
    setSelectedItinerary(folder)
  }

  const handleGoToExisting = async () => {
    if (!conflictingCityItinerary) return
    await router.navigate({
      to: '/itineraries/cities/$cityId',
      params: { cityId: conflictingCityItinerary.id },
    })
  }

  const defaultTrigger = (
    <Button variant="outline" size="sm" disabled={noCities}>
      <CalendarPlus />
      New itinerary
    </Button>
  )

  return (
    <Dialog>
      <DialogTrigger render={trigger ?? defaultTrigger} />
      <DialogContent className="w-auto sm:max-w-xl p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>
            {defaultCity
              ? `Create itinerary for ${defaultCity}`
              : 'Create a new itinerary'}
          </DialogTitle>
          {!defaultCity && (
            <DialogDescription>
              Pick a city from your saved activities and choose your travel
              dates.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-2 px-4 pb-4">
          <Select
            value={selectedCity}
            onValueChange={setSelectedCity}
            disabled={noCities}
          >
            <SelectTrigger className="w-full">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
              <SelectValue
                placeholder={
                  noCities ? 'No saved activities yet' : 'Select a city'
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cities with saved activities</SelectLabel>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            disabled={noCities}
          />

          <Collapsible className="flex flex-col gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full">
                Add to an existing itinerary?
                <ChevronDown />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-2">
              <Select
                onValueChange={handleSelectItinerary}
                onOpenChange={(open) => {
                  if (!open && !selectedItinerary) setSelectedItinerary(null)
                }}
              >
                <SelectTrigger
                  disabled={userHasNoItineraries}
                  className="w-full p-2"
                >
                  <SelectValue
                    placeholder={
                      userHasNoItineraries
                        ? 'You have no itineraries yet.'
                        : 'Select an itinerary'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {userFoldersQuery.data.length > 0 && (
                    <SelectGroup>
                      <SelectLabel>Your existing itineraries</SelectLabel>
                      {userFoldersQuery.data.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )}
                </SelectContent>
              </Select>

              {conflictingCityItinerary && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>City already in this itinerary</AlertTitle>
                  <AlertDescription className="flex flex-col gap-2">
                    <span>
                      <strong>{selectedItinerary?.title}</strong> already has an
                      itinerary for {selectedCity}. You can go to the existing
                      one, add a new one anyway, or choose a different
                      itinerary.
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="self-start"
                      onClick={handleGoToExisting}
                    >
                      Go to existing
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </CollapsibleContent>
          </Collapsible>

          <div className="flex gap-2">
            {conflictingCityItinerary && (
              <Button
                variant="ghost"
                className="flex-1"
                disabled={createIsPending}
                onClick={() => setSelectedItinerary(null)}
              >
                Cancel
              </Button>
            )}
            <Button
              disabled={createIsPending || !coords}
              variant={conflictingCityItinerary ? 'outline' : 'default'}
              className="flex-1"
              onClick={handleConfirmDates}
            >
              {createIsPending ? <Spinner /> : <CalendarCheck2 />}
              {createIsPending
                ? 'Saving...'
                : conflictingCityItinerary
                  ? 'Add anyway'
                  : selectedItinerary
                    ? `Add to ${selectedItinerary.title}`
                    : 'Confirm'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
