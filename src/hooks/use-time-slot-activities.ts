import { useSuspenseQuery } from '@tanstack/react-query'
import { timeSlotActivitiesQueryOptions } from '@/services/backend/saved-activities.options'

type UseTimeSlotActivitiesParams = {
  timeSlotId: string
}

export const useTimeSlotActivities = ({
  timeSlotId,
}: UseTimeSlotActivitiesParams) => {
  const timeSlotActivitiesQuery = useSuspenseQuery(
    timeSlotActivitiesQueryOptions({ timeSlotId }),
  )

  return { timeSlotActivitiesQuery }
}
