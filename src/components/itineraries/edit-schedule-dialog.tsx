import { DateRangePicker } from '@/components/date-range-picker'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { CalendarCheck2, CalendarCog } from 'lucide-react'
import { useState } from 'react'
import { DateRange } from 'react-day-picker'

interface EditScheduleDialogProps {
  cityItineraryId: string
}

export function EditScheduleDialog({
  cityItineraryId,
}: EditScheduleDialogProps) {
  const { itineraryQuery } = useSingleCityItinerary(cityItineraryId)
  const { itineraryDaysQuery, updateExistingDays, updateIsPending } =
    useItineraryDays(cityItineraryId)

  const [dateRange, setDateRange] = useState<DateRange>({
    from: itineraryDaysQuery.data[0].date,
    to: itineraryDaysQuery.data.at(-1)?.date,
  })
  const [open, setOpen] = useState(false)

  const handleConfirmDates = async () => {
    await updateExistingDays(dateRange)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full"
          onClick={() => setOpen(true)}
          variant="secondary"
        >
          <CalendarCog />
          Adjust dates
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto sm:max-w-xl p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Adjust dates for {itineraryQuery.data.city}</DialogTitle>
          <DialogDescription>
            What days will you be traveling?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 px-4 pb-4">
          <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />

          <Button disabled={updateIsPending} onClick={handleConfirmDates}>
            {updateIsPending ? <Spinner /> : <CalendarCheck2 />}
            {updateIsPending ? 'Updating...' : 'Confirm'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
