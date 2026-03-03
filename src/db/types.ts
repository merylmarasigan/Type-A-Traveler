import {
  cityItineraries,
  itineraryDays,
  itineraryFolders,
  lodging,
  savedActivities,
  timeSlots,
} from '@/db/schema/app'
import { user } from '@/db/schema/auth'
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

// ---------- ITINERARY DAYS ----------

export const insertItineraryDaySchema = createInsertSchema(itineraryDays).omit({
  id: true,
}) // Omit id as they are generated within the createItineraryDay() function
export type NewItineraryDay = z.infer<typeof insertItineraryDaySchema>

export const selectItineraryDaySchema = createSelectSchema(itineraryDays)
export type ItineraryDay = z.infer<typeof selectItineraryDaySchema>

export const updateItineraryDaySchema = createUpdateSchema(itineraryDays, {
  id: z.string(), // Makes id required for updates
})
export type UpdateItineraryDay = z.infer<typeof updateItineraryDaySchema>

// ---------- TIME SLOTS ----------

export const insertTimeSlotSchema = createInsertSchema(timeSlots).omit({
  id: true,
}) // Omit id as they are generated within the createTimeSlot() function
export type NewTimeSlot = z.infer<typeof insertTimeSlotSchema>

export const selectTimeSlotSchema = createSelectSchema(timeSlots)
export type TimeSlot = z.infer<typeof selectTimeSlotSchema>

export const updateTimeSlotSchema = createUpdateSchema(timeSlots, {
  id: z.string(), // Makes id required for updates
})
export type UpdateTimeSlot = z.infer<typeof updateTimeSlotSchema>

// ---------- SAVED ACTIVITIES ----------

export const insertSavedActivitySchema = createInsertSchema(
  savedActivities,
).omit({
  id: true,
}) // Omit id as they are generated within the createSavedActivity() function
export type NewSavedActivity = z.infer<typeof insertSavedActivitySchema>

export const selectSavedActivitySchema = createSelectSchema(savedActivities)
export type SavedActivity = z.infer<typeof selectSavedActivitySchema>

export const updateSavedActivitySchema = createUpdateSchema(savedActivities, {
  id: z.string(), // Makes id required for updates
})
export type UpdateSavedActivity = z.infer<typeof updateSavedActivitySchema>

// ---------- LODGING ----------

export const insertLodgingSchema = createInsertSchema(lodging).omit({
  id: true,
}) // Omit id as they are generated within the createLodging() function
export type NewLodging = z.infer<typeof insertLodgingSchema>

export const selectLodgingSchema = createSelectSchema(lodging)
export type Lodging = z.infer<typeof selectLodgingSchema>

export const updateLodgingSchema = createUpdateSchema(lodging, {
  id: z.string(), // Makes id required for updates
})
export type UpdateLodging = z.infer<typeof updateLodgingSchema>

// ---------- USERS ----------
export const updateUserSchema = createUpdateSchema(user, {
  id: z.string(), // Makes id required for updates
})
export type UpdateUser = z.infer<typeof updateUserSchema>
