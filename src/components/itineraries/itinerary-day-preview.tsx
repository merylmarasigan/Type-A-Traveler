import { Suspense } from 'react'
import { formatDate } from 'date-fns'
import type { ComponentProps } from 'react'
import type { ItineraryDay } from '@/db/types'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { TypographyLarge, TypographySmall } from '@/components/ui/typography'
import { useTimeSlots } from '@/hooks/use-time-slots'
import { cn, parseLocalDate } from '@/lib/utils'

interface ItineraryDayPreviewProps extends ComponentProps<'div'> {
  itineraryDay: ItineraryDay
  selected: boolean
}

export function ItineraryDayPreview(props: ItineraryDayPreviewProps) {
  return (
    <Suspense fallback={<ItineraryDayPreviewSkeleton />}>
      <ItineraryDayPreviewContent {...props} />
    </Suspense>
  )
}

function ItineraryDayPreviewSkeleton() {
  return (
    <div className="grid grid-flow-row md:grid-flow-col gap-2 p-2 w-24 md:w-full">
      <Skeleton className="h-5 w-8 place-self-center" />
      <div className="flex flex-col gap-1 w-full">
        <Skeleton className="h-5 w-12 self-end" />
        <Skeleton className="h-3 w-16 self-end" />
      </div>
    </div>
  )
}

function ItineraryDayPreviewContent({
  itineraryDay,
  selected,
  className,
  ...props
}: ItineraryDayPreviewProps) {
  const { timeSlotsQuery } = useTimeSlots({ itineraryDayId: itineraryDay.id })

  return (
    <div
      className={cn(
        'grid grid-flow-row md:grid-flow-col  gap-2 p-2 rounded-md hover:bg-primary hover:cursor-pointer w-24 md:w-full',
        selected && 'bg-primary',
        className,
      )}
      {...props}
    >
      {timeSlotsQuery.data.length > 0 ? (
        <Badge variant="secondary" className="place-self-center">
          {timeSlotsQuery.data.length}
        </Badge>
      ) : (
        <div className=""></div>
      )}
      <div className="flex flex-col gap-1 flex-1 row-start-2 md:row-start-1 place-self-end w-full">
        <TypographyLarge className="text-center md:text-end">
          {formatDate(parseLocalDate(itineraryDay.date), 'MMM d')}
        </TypographyLarge>
        <TypographySmall className="text-center md:text-end">
          {formatDate(parseLocalDate(itineraryDay.date), 'EEEE')}
        </TypographySmall>
      </div>
    </div>
  )
}
