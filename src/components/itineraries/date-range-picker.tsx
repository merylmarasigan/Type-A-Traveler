import { formatDate } from 'date-fns'
import type { Dispatch, SetStateAction } from 'react'
import type { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { TypographyMuted } from '@/components/ui/typography'

interface DateRangePickerProps {
  dateRange: DateRange
  setDateRange: Dispatch<SetStateAction<DateRange>>
  disabled?: boolean
}

export function DateRangePicker({
  dateRange,
  setDateRange,
  disabled,
}: DateRangePickerProps) {
  return (
    <>
      <Card>
        <CardContent className="sm:p-0">
          <Calendar
            disabled={disabled}
            required
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            showOutsideDays={false}
            className="w-full"
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
    </>
  )
}
