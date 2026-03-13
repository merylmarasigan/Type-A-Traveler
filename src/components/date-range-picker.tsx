import { Calendar } from '@/components/ui/calendar'
import { formatDate } from 'date-fns'
import { Dispatch, SetStateAction } from 'react'
import { type DateRange } from 'react-day-picker'
import { Card, CardContent } from '@/components/ui/card'
import { TypographyMuted, TypographySmall } from '@/components/ui/typography'

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
        <CardContent>
          <Calendar
            disabled={disabled}
            required
            mode="range"
            defaultMonth={dateRange.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
          />
        </CardContent>
      </Card>
      {disabled ? (
        <TypographySmall className="text-center text-destructive">
          You have no saved activities yet!
        </TypographySmall>
      ) : (
        <TypographyMuted className="text-center">
          {dateRange.from && dateRange.to && (
            <>
              {formatDate(dateRange.from, 'MMMM do, y')} -{' '}
              {formatDate(dateRange.to, 'MMMM do, y')}
            </>
          )}
        </TypographyMuted>
      )}
    </>
  )
}
