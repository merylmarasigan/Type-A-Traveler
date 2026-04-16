import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteItineraryDayMutationOptions,
  singleItineraryDayQueryOptions,
  updateItineraryDayMutationOptions,
} from '@/services/backend/itinerary-days.options'

type UseSingleItineraryDayParams = {
  itineraryDayId: string
}

export const useSingleItineraryDay = ({
  itineraryDayId,
}: UseSingleItineraryDayParams) => {
  const dayQuery = useSuspenseQuery(
    singleItineraryDayQueryOptions(itineraryDayId),
  )

  const updateDayMutation = useMutation(updateItineraryDayMutationOptions())

  const deleteDayMutation = useMutation(deleteItineraryDayMutationOptions())

  return {
    dayQuery,
    updateDayMutation,
    deleteDayMutation,
  }
}
