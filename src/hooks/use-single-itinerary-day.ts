import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteItineraryDayMutationOptions,
  singleItineraryDayQueryOptions,
  updateSingleItineraryDayMutationOptions,
} from '@/services/backend/itinerary-days.options'

type UseSingleItineraryDayParams = {
  itineraryDayId: string
}

export const useSingleItineraryDay = ({
  itineraryDayId,
}: UseSingleItineraryDayParams) => {
  const dayQuery = useSuspenseQuery(
    singleItineraryDayQueryOptions({ itineraryDayId }),
  )

  const updateDayMutation = useMutation(
    updateSingleItineraryDayMutationOptions(),
  )

  const deleteDayMutation = useMutation(deleteItineraryDayMutationOptions())

  return {
    dayQuery,
    updateDayMutation,
    deleteDayMutation,
  }
}
