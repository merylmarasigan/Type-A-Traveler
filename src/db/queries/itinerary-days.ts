import { db } from '@/db'
import { itineraryDays } from '@/db/schema/app'
import { NewItineraryDay, UpdateItineraryDay } from '@/db/types'
import { generateId } from 'better-auth'
import { eq } from 'drizzle-orm'

export const getCityItineraryDays = async (cityItineraryId: string) => {
  const result = await db
    .select()
    .from(itineraryDays)
    .where(eq(itineraryDays.cityItineraryId, cityItineraryId))

  return result
}

export const getItineraryDay = async (id: string) => {
  const [result] = await db
    .select()
    .from(itineraryDays)
    .where(eq(itineraryDays.id, id))
    .limit(1)

  return result
}

export const createItineraryDay = async (newItineraryDay: NewItineraryDay) => {
  const [result] = await db
    .insert(itineraryDays)
    .values({ ...newItineraryDay, id: generateId() })
    .returning()

  return result
}

export const updateItineraryDay = async (values: UpdateItineraryDay) => {
  const [result] = await db
    .update(itineraryDays)
    .set(values)
    .where(eq(itineraryDays.id, values.id))
    .returning()

  return result
}

export const deleteItineraryDay = async (id: string) => {
  const [deletedItineraryDay] = await db
    .delete(itineraryDays)
    .where(eq(itineraryDays.id, id))
    .returning()

  return deletedItineraryDay
}
