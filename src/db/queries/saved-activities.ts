import { generateId } from 'better-auth'
import { and, eq, getTableColumns, not, exists } from 'drizzle-orm'
import type { NewSavedActivity, UpdateSavedActivity } from '@/db/types'
import { db } from '@/db'
import {
  itineraryDays,
  savedActivities,
  timeSlotActivities,
  timeSlots,
} from '@/db/schema/app'

const { createdAt, updatedAt, ...savedActivityColumns } =
  getTableColumns(savedActivities)

export const getUserSavedActivities = async (userId: string, city?: string) => {
  const userIdClause = eq(savedActivities.userId, userId)
  const whereClause = city
    ? and(userIdClause, eq(savedActivities.city, city))
    : userIdClause

  const result = await db
    .select(savedActivityColumns)
    .from(savedActivities)
    .where(whereClause)

  return result
}

export const getCityItinerarySavedActivities = async (
  cityItineraryId: string,
) => {
  const result = await db
    .select({ savedActivities: savedActivityColumns })
    .from(savedActivities)
    .innerJoin(
      timeSlotActivities,
      eq(timeSlotActivities.savedActivityId, savedActivities.id),
    )
    .innerJoin(timeSlots, eq(timeSlots.id, timeSlotActivities.timeSlotId))
    .innerJoin(itineraryDays, eq(itineraryDays.id, timeSlots.itineraryDayId))
    .where(eq(itineraryDays.cityItineraryId, cityItineraryId))

  return result.map((r) => r.savedActivities)
}

export const getActivitiesForTimeSlot = async (timeSlotId: string) => {
  const result = await db
    .select({ savedActivities: savedActivityColumns })
    .from(savedActivities)
    .innerJoin(
      timeSlotActivities,
      eq(timeSlotActivities.savedActivityId, savedActivities.id),
    )
    .where(eq(timeSlotActivities.timeSlotId, timeSlotId))

  return result.map((r) => r.savedActivities)
}

export const getUnlinkedActivitiesForTimeSlot = async (
  timeSlotId: string,
  userId: string,
  city: string,
) => {
  const result = await db
    .select(savedActivityColumns)
    .from(savedActivities)
    .where(
      and(
        eq(savedActivities.userId, userId),
        eq(savedActivities.city, city),
        not(
          exists(
            db
              .select({ id: timeSlotActivities.id })
              .from(timeSlotActivities)
              .where(
                and(
                  eq(timeSlotActivities.savedActivityId, savedActivities.id),
                  eq(timeSlotActivities.timeSlotId, timeSlotId),
                ),
              ),
          ),
        ),
      ),
    )

  return result
}

export const getSavedActivity = async (id: string) => {
  const [result] = await db
    .select(savedActivityColumns)
    .from(savedActivities)
    .where(eq(savedActivities.id, id))
    .limit(1)

  return result
}

export const createSavedActivity = async (
  newSavedActivity: NewSavedActivity,
) => {
  const [result] = await db
    .insert(savedActivities)
    .values({ ...newSavedActivity, id: generateId() })
    .returning()

  return result
}

export const updateSavedActivity = async (values: UpdateSavedActivity) => {
  const [result] = await db
    .update(savedActivities)
    .set(values)
    .where(eq(savedActivities.id, values.id))
    .returning()

  return result
}

export const deleteSavedActivity = async (id: string) => {
  const [result] = await db
    .delete(savedActivities)
    .where(eq(savedActivities.id, id))
    .returning()

  return result
}

export const linkActivityToTimeSlot = async (
  savedActivityId: string,
  timeSlotId: string,
) => {
  const [result] = await db
    .insert(timeSlotActivities)
    .values({ id: generateId(), savedActivityId, timeSlotId })
    .returning()

  return result
}

export const unlinkActivityFromTimeSlot = async (
  savedActivityId: string,
  timeSlotId: string,
) => {
  const [result] = await db
    .delete(timeSlotActivities)
    .where(
      and(
        eq(timeSlotActivities.savedActivityId, savedActivityId),
        eq(timeSlotActivities.timeSlotId, timeSlotId),
      ),
    )
    .returning()

  return result
}
