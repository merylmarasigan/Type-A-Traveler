import { db } from '@/db'
import { itineraryDays, savedActivities, timeSlots } from '@/db/schema/app'
import { NewSavedActivity, UpdateSavedActivity } from '@/db/types'
import { generateId } from 'better-auth'
import { and, eq, getTableColumns } from 'drizzle-orm'

export const getUserSavedActivities = async (userId: string, city?: string) => {
  const userIdClause = eq(savedActivities.userId, userId)
  const whereClause = city
    ? and(userIdClause, eq(savedActivities.city, city))
    : userIdClause

  const result = await db.select().from(savedActivities).where(whereClause)

  return result
}

export const getCityItinerarySavedActivities = async (
  cityItineraryId: string,
) => {
  const result = await db
    .select({ savedActivities: getTableColumns(savedActivities) })
    .from(savedActivities)
    .innerJoin(timeSlots, eq(timeSlots.id, savedActivities.timeSlotId))
    .innerJoin(itineraryDays, eq(itineraryDays.id, timeSlots.itineraryDayId))
    .where(eq(itineraryDays.cityItineraryId, cityItineraryId))

  return result.map((r) => r.savedActivities)
}

export const getSavedActivity = async (id: string) => {
  const [result] = await db
    .select()
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
