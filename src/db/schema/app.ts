import {
  boolean,
  customType,
  date,
  index,
  integer,
  pgTable,
  text,
} from 'drizzle-orm/pg-core'
import { startEndTimestamps, timestamps } from '@/db/schema/columns.helpers'
import { sql, SQL } from 'drizzle-orm'

export const tsvector = customType<{
  data: string
}>({
  dataType() {
    return `tsvector`
  },
})

export const itineraryFolders = pgTable(
  'itinerary_folders',
  {
    id: text().primaryKey(),
    authorId: text().notNull(),
    title: text(),
    description: text(),
    flightNumbers: text().array(),
    notes: text(),
    isPublic: boolean().notNull().default(false),
    ...timestamps,
    search: tsvector()
      .notNull()
      .generatedAlwaysAs(
        (): SQL =>
          sql`setweight(to_tsvector('english', coalesce(${itineraryFolders.title}, '')), 'A')
        ||
        setweight(to_tsvector('english', coalesce(${itineraryFolders.description}, '')), 'B')`,
      ),
  },
  (t) => [index('idx_folder_search').using('gin', t.search)],
)

export const cityItineraries = pgTable(
  'city_itineraries',
  {
    id: text().primaryKey(),
    folderId: text()
      .notNull()
      .references(() => itineraryFolders.id, { onDelete: 'cascade' }),
    title: text(),
    description: text(),
    city: text().notNull(),
    lat: text().notNull(),
    lng: text().notNull(),
    budget: integer(),
    notes: text(),
    ...timestamps,
    search: tsvector()
      .notNull()
      .generatedAlwaysAs(
        (): SQL =>
          sql`setweight(to_tsvector('english', coalesce(${cityItineraries.title}, '')), 'A')
        ||
        setweight(to_tsvector('english', ${cityItineraries.city}), 'B')`,
      ),
  },
  (t) => [index('idx_city_search').using('gin', t.search)],
)

export const itineraryDays = pgTable('itinerary_days', {
  id: text().primaryKey(),
  cityItineraryId: text().notNull(),
  date: date({ mode: 'string' }).notNull(),
  ...timestamps,
})

export const timeSlots = pgTable('time_slots', {
  id: text().primaryKey(),
  itineraryDayId: text()
    .notNull()
    .references(() => itineraryDays.id, { onDelete: 'cascade' }),
  notes: text(),
  ...startEndTimestamps,
  ...timestamps,
})

export const savedActivities = pgTable('saved_activities', {
  id: text().primaryKey(),
  userId: text().notNull(),
  name: text().notNull(),
  city: text().notNull(),
  lat: text().notNull(),
  lng: text().notNull(),
  description: text(),
  imageUrl: text(),
  fsq_place_id: text(),
  trp_location_id: text(),
  ...timestamps,
})

export const timeSlotActivities = pgTable(
  'time_slot_activities',
  {
    id: text().primaryKey(),
    timeSlotId: text()
      .notNull()
      .references(() => timeSlots.id, { onDelete: 'cascade' }),
    savedActivityId: text().references(() => savedActivities.id, {
      onDelete: 'set null',
    }),
    savedActivityName: text().notNull(),
    savedActivityDescription: text(),
    savedActivityImageUrl: text(),
    savedActivityCity: text(),
    savedActivityLat: text(),
    savedActivityLng: text(),
    note: text(),
    ...timestamps,
    search: tsvector()
      .notNull()
      .generatedAlwaysAs(
        (): SQL =>
          sql`to_tsvector('english', ${timeSlotActivities.savedActivityName})`,
      ),
  },
  (t) => [index('idx_activity_search').using('gin', t.search)],
)

export const lodging = pgTable('lodging', {
  id: text().primaryKey(),
  itineraryId: text()
    .notNull()
    .references(() => itineraryFolders.id, { onDelete: 'cascade' }),
  name: text().notNull(),
  address: text(),
  ...timestamps,
})
