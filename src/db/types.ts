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

// createdAt and updatedAt are for internal use only
const omittedTimestamps = { createdAt: true, updatedAt: true } as const
// IDs are generated in each table's respective create function
const omittedWithId = { ...omittedTimestamps, id: true } as const

// ---------- ITINERARY FOLDERS ----------

export const insertItineraryFolderSchema =
  createInsertSchema(itineraryFolders).omit(omittedWithId)
export type NewItineraryFolder = z.infer<typeof insertItineraryFolderSchema>

export const selectItineraryFolderSchema =
  createSelectSchema(itineraryFolders).omit(omittedTimestamps)
export type ItineraryFolder = z.infer<typeof selectItineraryFolderSchema>

export const updateItineraryFolderSchema = createUpdateSchema(
  itineraryFolders,
  {
    id: z.string(), // Makes id required for updates
  },
).omit(omittedTimestamps)
export type UpdateItineraryFolder = z.infer<typeof updateItineraryFolderSchema>

// ---------- CITY ITINERARIES ----------

export const insertCityItinerarySchema =
  createInsertSchema(cityItineraries).omit(omittedWithId)
export type NewCityItinerary = z.infer<typeof insertCityItinerarySchema>

export const selectCityItinerarySchema = createSelectSchema(cityItineraries)
  .omit(omittedTimestamps)
  .extend({ authorId: z.string() })
export type CityItinerary = z.infer<typeof selectCityItinerarySchema>

export const updateCityItinerarySchema = createUpdateSchema(cityItineraries, {
  id: z.string(), // Makes id required for updates
}).omit(omittedTimestamps)
export type UpdateCityItinerary = z.infer<typeof updateCityItinerarySchema>

// ---------- ITINERARY DAYS ----------

export const insertItineraryDaySchema =
  createInsertSchema(itineraryDays).omit(omittedWithId)
export type NewItineraryDay = z.infer<typeof insertItineraryDaySchema>

export const selectItineraryDaySchema = createSelectSchema(itineraryDays)
  .omit(omittedTimestamps)
  .extend({ authorId: z.string() })
export type ItineraryDay = z.infer<typeof selectItineraryDaySchema>

export const updateItineraryDaySchema = createUpdateSchema(itineraryDays, {
  id: z.string(), // Makes id required for updates
}).omit(omittedTimestamps)
export type UpdateItineraryDay = z.infer<typeof updateItineraryDaySchema>

// ---------- TIME SLOTS ----------

export const insertTimeSlotSchema =
  createInsertSchema(timeSlots).omit(omittedWithId)
export type NewTimeSlot = z.infer<typeof insertTimeSlotSchema>

export const selectTimeSlotSchema = createSelectSchema(timeSlots)
  .omit(omittedTimestamps)
  .extend({ authorId: z.string() })
export type TimeSlot = z.infer<typeof selectTimeSlotSchema>

export const updateTimeSlotSchema = createUpdateSchema(timeSlots, {
  id: z.string(), // Makes id required for updates
}).omit(omittedTimestamps)
export type UpdateTimeSlot = z.infer<typeof updateTimeSlotSchema>

// ---------- SAVED ACTIVITIES ----------

export const insertSavedActivitySchema =
  createInsertSchema(savedActivities).omit(omittedWithId)
export type NewSavedActivity = z.infer<typeof insertSavedActivitySchema>

export const selectSavedActivitySchema =
  createSelectSchema(savedActivities).omit(omittedTimestamps)
export type SavedActivity = z.infer<typeof selectSavedActivitySchema>

export const updateSavedActivitySchema = createUpdateSchema(savedActivities, {
  id: z.string(), // Makes id required for updates
}).omit(omittedTimestamps)
export type UpdateSavedActivity = z.infer<typeof updateSavedActivitySchema>

// ---------- LODGING ----------

export const insertLodgingSchema =
  createInsertSchema(lodging).omit(omittedWithId)
export type NewLodging = z.infer<typeof insertLodgingSchema>

export const selectLodgingSchema = createSelectSchema(lodging)
  .omit(omittedTimestamps)
  .extend({ authorId: z.string() })
export type Lodging = z.infer<typeof selectLodgingSchema>

export const updateLodgingSchema = createUpdateSchema(lodging, {
  id: z.string(), // Makes id required for updates
}).omit(omittedTimestamps)
export type UpdateLodging = z.infer<typeof updateLodgingSchema>

// ---------- USERS ----------
export const updateUserSchema = createUpdateSchema(user, {
  id: z.string(), // Makes id required for updates
}).omit(omittedTimestamps)
export type UpdateUser = z.infer<typeof updateUserSchema>
