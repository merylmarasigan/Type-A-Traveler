import {
  createItineraryFolder,
  deleteItineraryFolder,
  getItineraryFolder,
  getItineraryFolders,
  getUserItineraryFolders,
  updateItineraryFolder,
} from '@/db/queries/itinerary-folders'
import {
  insertItineraryFolderSchema,
  updateItineraryFolderSchema,
} from '@/db/types'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'

export const getMultipleItineraryFoldersFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ limit: z.number().optional() }))
  .handler(async ({ data }) => {
    const folders = await getItineraryFolders(data.limit)

    return folders
  })

export const getUserItineraryFoldersFn = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const folders = await getUserItineraryFolders(data.userId)

    return folders
  })

export const getSingleItineraryFolderFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ itineraryFolderId: z.string() }))
  .handler(async ({ data }) => {
    const folder = await getItineraryFolder(data.itineraryFolderId)

    return folder
  })

export const createItineraryFolderFn = createServerFn({ method: 'POST' })
  .inputValidator(insertItineraryFolderSchema)
  .handler(async ({ data }) => {
    const newFolder = await createItineraryFolder(data)

    return newFolder
  })

export const updateItineraryFolderFn = createServerFn({ method: 'POST' })
  .inputValidator(updateItineraryFolderSchema)
  .handler(async ({ data }) => {
    const updatedFolder = await updateItineraryFolder(data)

    return updatedFolder
  })

export const deleteItineraryFolderFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ itineraryFolderId: z.string() }))
  .handler(async ({ data }) => {
    await deleteItineraryFolder(data.itineraryFolderId)
  })
