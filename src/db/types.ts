import { itineraryFolders } from '@/db/schema/app'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import z from 'zod'

export const insertItineraryFolderSchema = createInsertSchema(
  itineraryFolders,
).omit({ id: true }) // Omit id as they are generated within the createItineraryFolder() function
export type NewItineraryFolder = z.infer<typeof insertItineraryFolderSchema>

export const selectItineraryFolderSchema = createSelectSchema(itineraryFolders)
export type ItineraryFolder = z.infer<typeof selectItineraryFolderSchema>

export const updateItineraryFolderSchema = createUpdateSchema(
  itineraryFolders,
  {
    id: z.string(), // Makes id required for updates
  },
)
export type UpdateItineraryFolder = z.infer<typeof updateItineraryFolderSchema>
