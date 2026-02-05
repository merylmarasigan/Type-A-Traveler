import {
  cityItineraries,
  days,
  flights,
  itineraries,
  lodging,
  timeSlots,
} from '@/db/schema/app'
import { user } from '@/db/schema/auth'
import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

export const userRelations = relations(user, ({ many }) => ({
  itineraries: many(itineraries),
  usersToCityItineraries: many(usersToCityItineraries),
}))

export const itinerariesRelations = relations(itineraries, ({ one, many }) => ({
  author: one(user, {
    fields: [itineraries.authorId],
    references: [user.id],
  }),
  cities: many(cityItineraries),
  flights: many(flights),
  lodging: many(lodging),
}))

export const cityItinerariesRelations = relations(
  cityItineraries,
  ({ one, many }) => ({
    parentItinerary: one(itineraries, {
      fields: [cityItineraries.parentItineraryId],
      references: [itineraries.id],
    }),
    usersToCityItineraries: many(usersToCityItineraries),
    schedule: many(days),
  }),
)

export const usersToCityItineraries = pgTable(
  'users_to_city_itineraries',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id),
    cityItineraryId: text('city_itinerary_id')
      .notNull()
      .references(() => cityItineraries.id),
  },
  (t) => [primaryKey({ columns: [t.userId, t.cityItineraryId] })],
)

export const usersToCityItinerariesRelations = relations(
  usersToCityItineraries,
  ({ one }) => ({
    cityItinerary: one(cityItineraries, {
      fields: [usersToCityItineraries.cityItineraryId],
      references: [cityItineraries.id],
    }),
    user: one(user, {
      fields: [usersToCityItineraries.userId],
      references: [user.id],
    }),
  }),
)

export const daysRelations = relations(days, ({ one, many }) => ({
  city: one(cityItineraries, {
    fields: [days.cityItineraryId],
    references: [cityItineraries.id],
  }),
  timeSlots: many(timeSlots),
}))

export const timeSlotRelations = relations(timeSlots, ({ one }) => ({
  day: one(days, {
    fields: [timeSlots.dayId],
    references: [days.id],
  }),
}))

export const flightsRelations = relations(flights, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [flights.itineraryId],
    references: [itineraries.id],
  }),
}))

export const lodgingRelations = relations(lodging, ({ one }) => ({
  itinerary: one(itineraries, {
    fields: [lodging.itineraryId],
    references: [itineraries.id],
  }),
}))
