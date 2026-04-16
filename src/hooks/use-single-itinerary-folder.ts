import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import {
  deleteItineraryFolderMutationOptions,
  singleItineraryFolderQueryOptions,
  updateItineraryFolderMutationOptions,
} from '@/services/backend/itinerary-folders.options'

export const useSingleItineraryFolder = (itineraryFolderId: string) => {
  const folderQuery = useSuspenseQuery(
    singleItineraryFolderQueryOptions(itineraryFolderId),
  )

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
