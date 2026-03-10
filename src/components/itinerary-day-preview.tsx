import { Badge } from '@/components/ui/badge'
import { TypographyLarge, TypographySmall } from '@/components/ui/typography'
import { ItineraryDay } from '@/db/types'
import { useTimeSlots } from '@/hooks/use-time-slots'
import { cn } from '@/lib/utils'
import { formatDate } from 'date-fns'
import { ComponentProps } from 'react'

interface ItineraryDayPreviewProps extends ComponentProps<'div'> {
  itineraryDay: ItineraryDay
  selected: boolean
}

export function ItineraryDayPreview({
  itineraryDay,
  selected,
  className,
  ...props
}: ItineraryDayPreviewProps) {
  const { timeSlotsQuery } = useTimeSlots(itineraryDay.id)

  return (
    <div
      className={cn(
        'flex justify-between items-center gap-2 p-2 rounded-md hover:bg-accent hover:cursor-pointer',
        selected && 'bg-accent',
        className,
      )}
      {...props}
    >
      {timeSlotsQuery.data.length > 0 && (
        <Badge>{timeSlotsQuery.data.length}</Badge>
      )}
      <div className="flex flex-col gap-1 flex-1">
        <TypographyLarge className="text-end">
          {formatDate(itineraryDay.date, 'MMM d')}
        </TypographyLarge>
        <TypographySmall className="text-muted-foreground text-end">
          {formatDate(itineraryDay.date, 'EEEE')}
        </TypographySmall>
      </div>
    </div>
  )
}
