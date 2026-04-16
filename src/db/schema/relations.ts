import { relations } from 'drizzle-orm'
import {
  cityItineraries,
  itineraryDays,
  itineraryFolders,
  lodging,
  savedActivities,
  timeSlots,
} from '@/db/schema/app'
import { user } from '@/db/schema/auth'

export const userRelations = relations(user, ({ many }) => ({
  itineraries: many(itineraryFolders),
  bookmarks: many(savedActivities),
}))

export const itinerariesRelations = relations(
  itineraryFolders,
  ({ one, many }) => ({
    author: one(user, {
      fields: [itineraryFolders.authorId],
      references: [user.id],
    }),
    cities: many(cityItineraries),
    lodging: many(lodging),
  }),
)

export const cityItinerariesRelations = relations(
  cityItineraries,
  ({ one, many }) => ({
    folder: one(itineraryFolders, {
      fields: [cityItineraries.folderId],
      references: [itineraryFolders.id],
    }),
    schedule: many(itineraryDays),
  }),
)

export const itineraryDaysRelations = relations(
  itineraryDays,
  ({ one, many }) => ({
    city: one(cityItineraries, {
      fields: [itineraryDays.cityItineraryId],
      references: [cityItineraries.id],
    }),
    timeSlots: many(timeSlots),
  }),
)

export const timeSlotRelations = relations(timeSlots, ({ one, many }) => ({
  itineraryDay: one(itineraryDays, {
    fields: [timeSlots.itineraryDayId],
    references: [itineraryDays.id],
  }),
  activities: many(savedActivities),
}))

export const savedActivitiesRelations = relations(
  savedActivities,
  ({ one }) => ({
    user: one(user, {
      fields: [savedActivities.userId],
      references: [user.id],
    }),
    timeSlot: one(timeSlots, {
      fields: [savedActivities.timeSlotId],
      references: [timeSlots.id],
    }),
  }),
)

export const lodgingRelations = relations(lodging, ({ one }) => ({
  itinerary: one(itineraryFolders, {
    fields: [lodging.itineraryId],
    references: [itineraryFolders.id],
  }),
}))
