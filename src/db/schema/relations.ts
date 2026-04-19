import { relations } from 'drizzle-orm'
import {
  cityItineraries,
  itineraryDays,
  itineraryFolders,
  lodging,
  savedActivities,
  timeSlotActivities,
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
  activities: many(timeSlotActivities),
}))

export const savedActivitiesRelations = relations(
  savedActivities,
  ({ one, many }) => ({
    user: one(user, {
      fields: [savedActivities.userId],
      references: [user.id],
    }),
    timeSlots: many(timeSlotActivities),
  }),
)

export const timeSlotActivitiesRelations = relations(
  timeSlotActivities,
  ({ one }) => ({
    timeSlot: one(timeSlots, {
      fields: [timeSlotActivities.timeSlotId],
      references: [timeSlots.id],
    }),
    savedActivity: one(savedActivities, {
      fields: [timeSlotActivities.savedActivityId],
      references: [savedActivities.id],
    }),
  }),
)

export const lodgingRelations = relations(lodging, ({ one }) => ({
  itinerary: one(itineraryFolders, {
    fields: [lodging.itineraryId],
    references: [itineraryFolders.id],
  }),
}))
