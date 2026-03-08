import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { addDays, formatDate } from 'date-fns'
import { CalendarCheck2 } from 'lucide-react'
import { useState } from 'react'
import { type DateRange } from 'react-day-picker'
import { useItineraryDays } from '@/hooks/use-itinerary-days'
import { Spinner } from '@/components/ui/spinner'
import { useRouter } from '@tanstack/react-router'
import { Card, CardContent } from '@/components/ui/card'
import { TypographyMuted } from '@/components/ui/typography'

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
    <div className="flex flex-col gap-3 px-4 pb-4">
      <Card>
        <CardContent>
          <Calendar
            required
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </CardContent>
      </Card>
      <TypographyMuted className="text-center">
        {dateRange.from && dateRange.to && (
          <>
            {formatDate(dateRange.from, 'MMMM do, y')} -{' '}
            {formatDate(dateRange.to, 'MMMM do, y')}
          </>
        )}
      </TypographyMuted>
      <Button disabled={createIsPending} onClick={handleConfirmDates}>
        {createIsPending ? <Spinner /> : <CalendarCheck2 />}
        {createIsPending ? 'Saving...' : 'Confirm'}
      </Button>
    </div>
  )
}
