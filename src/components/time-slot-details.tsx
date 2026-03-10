import { SavedActivityPreview } from '@/components/saved-activities/saved-activity-preview'
import { TypographySmall } from '@/components/ui/typography'
import { SavedActivity, TimeSlot } from '@/db/types'
import { formatDate } from 'date-fns'

interface TimeSlotDetailsProps {
  timeSlot: TimeSlot
  activities: SavedActivity[]
}

export function TimeSlotDetails({
  timeSlot,
  activities,
}: TimeSlotDetailsProps) {
  if (!timeSlot.startTime || !timeSlot.endTime) return null

  return (
    <div className="flex flex-col gap-2">
      <TypographySmall>
        {formatDate(timeSlot.startTime, 'p')} -{' '}
        {formatDate(timeSlot.endTime, 'p')}
      </TypographySmall>
      <div className="flex flex-wrap gap-2">
        {activities.map((activity) => (
          <SavedActivityPreview key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  )
}
