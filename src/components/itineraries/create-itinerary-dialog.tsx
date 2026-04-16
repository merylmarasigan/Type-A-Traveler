import { useRouter } from '@tanstack/react-router'
import { addDays } from 'date-fns'
import { useState } from 'react'
import { CalendarCheck2, CalendarPlus, ChevronDown } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { DateRangePicker } from '@/components/date-range-picker'
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

interface CreateItineraryDialogProps {
  city: string
  lat: string
  lng: string
}

export function CreateItineraryDialog({
  city,
  lat,
  lng,
}: CreateItineraryDialogProps) {
  const { userActivitiesQuery } = useSavedActivities({ city })
  const { userFoldersQuery } = useItineraryFolders(50)
  const { createInitialDays, createIsPending } = useItineraryDays()
  const router = useRouter()

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 14),
  })
  const [selectedItinerary, setSelectedItinerary] =
    useState<ItineraryFolder | null>(null)

  const handleConfirmDates = async () => {
    const { itineraryFolderId } = await createInitialDays(
      dateRange,
      city,
      lat,
      lng,
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

  const noSavedActivities = userActivitiesQuery.data.length === 0
  const userHasNoItineraries = userFoldersQuery.data.length === 0

  return (
    <Dialog>
      <DialogTrigger>
        <Button disabled={noSavedActivities}>
          Create new itinerary
          <CalendarPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto sm:max-w-xl p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Create your itinerary for {city}</DialogTitle>
          <DialogDescription>
            What days will you be traveling?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 px-4 pb-4">
          <DateRangePicker
            dateRange={dateRange}
            setDateRange={setDateRange}
            disabled={noSavedActivities}
          />

          <Collapsible className="flex flex-col gap-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full">
                Add to an existing itinerary?
                <ChevronDown />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Select onValueChange={handleSelectItinerary}>
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
            </CollapsibleContent>
          </Collapsible>

          <Button disabled={createIsPending} onClick={handleConfirmDates}>
            {createIsPending ? <Spinner /> : <CalendarCheck2 />}
            {createIsPending
              ? 'Saving...'
              : selectedItinerary
                ? `Add to ${selectedItinerary.title}`
                : 'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
