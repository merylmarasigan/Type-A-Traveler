import { Badge } from '@/components/ui/badge'
import { TypographyLarge, TypographySmall } from '@/components/ui/typography'
import { ItineraryDay } from '@/db/types'
import { useTimeSlots } from '@/hooks/use-time-slots'
import { cn } from '@/lib/utils'
import { formatDate } from 'date-fns'
import { ComponentProps } from 'react'
import { parseLocalDate } from '@/lib/utils'


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
        'grid grid-flow-row md:grid-flow-col  gap-2 p-2 rounded-md hover:bg-accent hover:cursor-pointer w-24 md:w-full',
        selected && 'bg-accent',
        className,
      )}
      {...props}
    >
      {timeSlotsQuery.data.length > 0 ? (
        <Badge className="place-self-center">
          {timeSlotsQuery.data.length}
        </Badge>
      ) : (
        <div className=""></div>
      )}
      <div className="flex flex-col gap-1 flex-1 row-start-2 md:row-start-1 place-self-end w-full">
        <TypographyLarge className="text-center md:text-end">
          {formatDate(parseLocalDate(itineraryDay.date), 'MMM d')}
        </TypographyLarge>
        <TypographySmall className="text-muted-foreground text-center md:text-end">
          {formatDate(parseLocalDate(itineraryDay.date), 'EEEE')}
        </TypographySmall>
      </div>
    </div>
  )
}
