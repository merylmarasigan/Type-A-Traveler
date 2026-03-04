import {
  cityItineraryDaysQueryOptions,
  createItineraryDayMutationOptions,
} from '@/services/backend/itinerary-days.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useItineraryDays = (cityItineraryId: string) => {
  const itineraryDaysQuery = useSuspenseQuery(
    cityItineraryDaysQueryOptions(cityItineraryId),
  )

  const createItineraryDayMutation = useMutation(
    createItineraryDayMutationOptions(),
  )

  return {
    itineraryDaysQuery,
    createItineraryDayMutation,
  }
}
