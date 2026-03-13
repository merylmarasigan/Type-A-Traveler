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
import { authClient } from '@/lib/auth-client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
import { useRouter } from '@tanstack/react-router'
import { addDays } from 'date-fns'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'
import { Spinner } from '@/components/ui/spinner'
import { CalendarCheck2, ChevronDown } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ItineraryFolder } from '@/db/types'

interface CreateItineraryDialogProps {
  city: string
}

export function CreateItineraryDialog({ city }: CreateItineraryDialogProps) {
  const { data } = authClient.useSession()
  const { userActivitiesQuery } = useSavedActivities({ city })
  const { foldersQuery } = useItineraryFolders(data?.user.id, 50)
  const { createInitialDays, createIsPending } = useItineraryDays()
  const router = useRouter()

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 14),
  })
  const [selectedItinerary, setSelectedItinerary] =
    useState<ItineraryFolder | null>(null)

  const noSavedActivities = userActivitiesQuery.data.length === 0

  const handleConfirmDates = async () => {
    if (selectedItinerary) {
      // TODO: implement adding to existing itinerary
    } else {
      const { itineraryFolder } = await createInitialDays(dateRange, city)

      await router.navigate({
        to: '/itineraries/$id',
        params: { id: itineraryFolder.id },
      })
    }
  }

  const handleSelectItinerary = (id: string) => {
    const folder = foldersQuery.data.find((folder) => folder.id === id) ?? null
    setSelectedItinerary(folder)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={noSavedActivities}>Create your itinerary</Button>
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

          {foldersQuery.data.length > 0 && (
            <Collapsible className="flex flex-col gap-2">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full">
                  Add to an existing itinerary?
                  <ChevronDown />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Select onValueChange={handleSelectItinerary}>
                  <SelectTrigger className="w-full p-2">
                    <SelectValue placeholder="Select an itinerary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {foldersQuery.data.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id}>
                          {folder.title}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </CollapsibleContent>
            </Collapsible>
          )}

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
