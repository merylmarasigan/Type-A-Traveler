import {
  deleteItineraryFolderMutationOptions,
  singleItineraryFolderQueryOptions,
  updateItineraryFolderMutationOptions,
} from '@/services/backend/itinerary-folders.options'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'

export const useItineraryFolder = (id: string) => {
  const folderQuery = useSuspenseQuery(singleItineraryFolderQueryOptions(id))

  const updateFolderMutation = useMutation(
    updateItineraryFolderMutationOptions(),
  )

  const deleteFolderMutation = useMutation(
    deleteItineraryFolderMutationOptions(),
  )

  return {
    folderQuery,
    updateFolderMutation,
    deleteFolderMutation,
  }
}
