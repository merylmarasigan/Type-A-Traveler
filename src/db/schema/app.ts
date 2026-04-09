import { startEndTimestamps, timestamps } from '@/db/schema/columns.helpers'
import { pgTable, text, integer, date } from 'drizzle-orm/pg-core'

export const itineraryFolders = pgTable('itinerary_folders', {
  id: text().primaryKey(),
  authorId: text().notNull(),
  title: text(),
  description: text(),
  flightNumbers: text().array(),
  notes: text(),
  ...timestamps,
})

export const cityItineraries = pgTable('city_itineraries', {
  id: text().primaryKey(),
  folderId: text().notNull(),
  title: text(),
  description: text(),
  city: text().notNull(),
  budget: integer(),
  notes: text(),
  ...timestamps,
})

export const itineraryDays = pgTable('itinerary_days', {
  id: text().primaryKey(),
  cityItineraryId: text().notNull(),
  date: date({ mode: 'date' }).notNull(),
  ...timestamps,
})

export const timeSlots = pgTable('time_slots', {
  id: text().primaryKey(),
  itineraryDayId: text().notNull(),
  notes: text(),
  ...startEndTimestamps,
  ...timestamps,
})

export const savedActivities = pgTable('saved_activities', {
  id: text().primaryKey(),
  userId: text().notNull(),
  timeSlotId: text(),
  name: text().notNull(),
  city: text().notNull(),
  description: text(),
  imageUrl: text(),
  fsq_place_id: text(),
  trp_location_id: text(),
  ...timestamps,
})

export const lodging = pgTable('lodging', {
  id: text().primaryKey(),
  itineraryId: text().notNull(),
  name: text().notNull(),
  address: text(),
  ...timestamps,
})
