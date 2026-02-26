import { cityItineraries, itineraryFolders } from '@/db/schema/app'
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import z from 'zod'

// ---------- ITINERARY FOLDERS ----------

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

// ---------- CITY ITINERARIES ----------

export const insertCityItinerarySchema = createInsertSchema(
  cityItineraries,
).omit({ id: true }) // Omit id as they are generated within the createCityItinerary() function
export type NewCityItinerary = z.infer<typeof insertCityItinerarySchema>

export const selectCityItinerarySchema = createSelectSchema(cityItineraries)
export type CityItinerary = z.infer<typeof selectCityItinerarySchema>

export const updateCityItinerarySchema = createUpdateSchema(cityItineraries, {
  id: z.string(), // Makes id required for updates
})
export type UpdateCityItinerary = z.infer<typeof updateCityItinerarySchema>
