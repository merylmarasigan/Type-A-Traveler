import { timestamps } from '@/db/schema/columns.helpers'
import { pgTable, text, integer, date, timestamp } from 'drizzle-orm/pg-core'

export const itineraries = pgTable('itineraries', {
  id: text().primaryKey(),
  authorId: text().notNull(),
  title: text().notNull(),
  ...timestamps,
})

export const cityItineraries = pgTable('city_itineraries', {
  id: text().primaryKey(),
  parentItineraryId: text().notNull(),
  title: text().notNull(),
  location: text().notNull(),
  budget: integer(),
  ...timestamps,
})

export const days = pgTable('days', {
  id: text().primaryKey(),
  cityItineraryId: text().notNull(),
  date: date().notNull(),
  ...timestamps,
})

export const timeSlots = pgTable('time_slots', {
  id: text().primaryKey(),
  dayId: text().notNull(),
  start: timestamp().notNull(),
  end: timestamp().notNull(),
  destination: text().notNull(),
  notes: text(),
  ...timestamps,
})

export const flights = pgTable('flights', {
  id: text().primaryKey(),
  itineraryId: text().notNull(),
  flightNo: text().notNull(),
  departure: timestamp().notNull(),
  arrival: timestamp().notNull(),
  fromCity: text().notNull(),
  toCity: text().notNull(),
  confirmationNo: text(),
  ...timestamps,
})

export const lodging = pgTable('lodging', {
  id: text().primaryKey(),
  itineraryId: text().notNull(),
  name: text().notNull(),
  address: text(),
  confirmationNo: text(),
  ...timestamps,
})
