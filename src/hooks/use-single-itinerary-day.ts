import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteItineraryDayMutationOptions,
  singleItineraryDayQueryOptions,
  updateItineraryDayMutationOptions,
} from '@/services/backend/itinerary-days.options'

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
