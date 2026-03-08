import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Field, FieldLabel } from '@/components/ui/field'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { TypographyH3 } from '@/components/ui/typography'
import { addDays, format } from 'date-fns'
import { CalendarCheck2, CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { type DateRange } from 'react-day-picker'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from '@tanstack/react-router'

interface DateRangePickerProps {
  city: string
}

export function DateRangePicker({ city }: DateRangePickerProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 14),
  })

  const { createInitialDays, createIsPending } = useItineraryDays()
  const router = useRouter()

  const handleConfirmDates = async () => {
    const { itineraryFolder } = await createInitialDays(dateRange, city)

    await router.navigate({
      to: '/itineraries/$id',
      params: { id: itineraryFolder.id },
    })
  }

  return (
    <div className="flex flex-col gap-2">
      <TypographyH3>Schedule</TypographyH3>
      <Field className="mx-auto w-60">
        <FieldLabel htmlFor="date-picker-range">Select your dates</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker-range"
              className="justify-start px-2.5 font-normal"
            >
              <CalendarIcon />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} -{' '}
                    {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              defaultMonth={dateRange.from}
              selected={dateRange}
              required
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Button disabled={createIsPending} onClick={handleConfirmDates}>
        {createIsPending ? <Spinner /> : <CalendarCheck2 />}
        {createIsPending ? 'Saving...' : 'Confirm'}
      </Button>
    </div>
  )
}
