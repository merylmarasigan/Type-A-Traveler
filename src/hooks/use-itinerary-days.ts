import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import { authClient } from '@/lib/auth-client'
import {
  cityItineraryDaysQueryOptions,
  createItineraryDaysMutationOptions,
  updateMultipleItineraryDaysMutationOptions,
} from '@/services/backend/itinerary-days.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { eachDayOfInterval } from 'date-fns'
import { DateRange } from 'react-day-picker'

export const useItineraryDays = (cityItineraryId?: string) => {
  const { data } = authClient.useSession()

  const { createFolderMutation } = useItineraryFolders()
  const { createCityItineraryMutation } = useCityItineraries()

  const itineraryDaysQuery = useSuspenseQuery(
    cityItineraryDaysQueryOptions(cityItineraryId),
  )

  const createItineraryDaysMutation = useMutation(
    createItineraryDaysMutationOptions(),
  )

  const updateMultipleItineraryDaysMutation = useMutation(
    updateMultipleItineraryDaysMutationOptions(),
  )

  /**
   * Create the initial `ItineraryDays` based on the given `DateRange` when creating a new `CityItinerary`
   */
  const createInitialDays = async (
    dateRange: DateRange,
    city: string,
    existingFolderId?: string,
  ) => {
    // TODO: show toast or throw a redirect
    if (!data?.user) throw new Error('Unauthorized')
    if (!dateRange.from || !dateRange.to) throw new Error('Date range required')

    const itineraryFolderId =
      existingFolderId ??
      (
        await createFolderMutation.mutateAsync({
          authorId: data.user.id,
          title: 'My Itinerary',
        })
      ).id

    const cityItinerary = await createCityItineraryMutation.mutateAsync({
      city,
      folderId: itineraryFolderId,
      title: `Itinerary for ${city}`,
    })

    const intervalDates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    })
    const createdDates = await createItineraryDaysMutation.mutateAsync(
      intervalDates.map((date) => ({
        cityItineraryId: cityItinerary.id,
        date,
      })),
    )

    return { createdDates, itineraryFolderId }
  }

  /**
   * Update the `ItineraryDays` for an existing `CityItinerary` based on the given `DateRange`
   */
  const updateExistingDays = async (dateRange: DateRange) => {
    if (!cityItineraryId || !data?.user || !dateRange.from || !dateRange.to)
      return

    const intervalDates = eachDayOfInterval({
      start: dateRange.from,
      end: dateRange.to,
    })

    const newDays = await updateMultipleItineraryDaysMutation.mutateAsync(
      intervalDates.map((date) => ({
        cityItineraryId,
        date,
      })),
    )

    return newDays
  }

  return {
    itineraryDaysQuery,
    createInitialDays,
    createIsPending:
      createFolderMutation.isPending ||
      createCityItineraryMutation.isPending ||
      createItineraryDaysMutation.isPending,
    updateExistingDays,
    updateIsPending: updateMultipleItineraryDaysMutation.isPending,
  }
}
