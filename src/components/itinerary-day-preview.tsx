import { Badge } from '@/components/ui/badge'
import { TypographyLarge, TypographySmall } from '@/components/ui/typography'
import { ItineraryDay } from '@/db/types'
import { useTimeSlots } from '@/hooks/use-time-slots'
import { formatDate } from 'date-fns'

interface ItineraryDayPreviewProps {
  itineraryDay: ItineraryDay
}

export function ItineraryDayPreview({
  itineraryDay,
}: ItineraryDayPreviewProps) {
  const { timeSlotsQuery } = useTimeSlots(itineraryDay.id)

  return (
    <div className="flex justify-between items-center gap-2">
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
