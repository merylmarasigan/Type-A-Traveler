import {
  deleteItineraryDayMutationOptions,
  singleItineraryDayQueryOptions,
  updateItineraryDayMutationOptions,
} from '@/services/backend/itinerary-days.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useSingleItineraryDay = (itineraryDayId: string) => {
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
