import { db } from '@/db'
import { itineraryDays } from '@/db/schema/app'
import { ItineraryDay, NewItineraryDay, UpdateItineraryDay } from '@/db/types'
import { generateId } from 'better-auth'
import { eq, inArray } from 'drizzle-orm'

export const getCityItineraryDays = async (cityItineraryId: string) => {
  const result = await db
    .select()
    .from(itineraryDays)
    .where(eq(itineraryDays.cityItineraryId, cityItineraryId))
    .orderBy(itineraryDays.date)

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

export const createItineraryDays = async (
  newItineraryDays: NewItineraryDay[],
) => {
  const result = await db
    .insert(itineraryDays)
    .values(
      newItineraryDays.map((day) => ({
        ...day,
        id: generateId(),
      })),
    )
    .returning()

  return result
}

export const updateSingleItineraryDay = async (values: UpdateItineraryDay) => {
  const [result] = await db
    .update(itineraryDays)
    .set(values)
    .where(eq(itineraryDays.id, values.id))
    .returning()

  return result
}

export const updateMultipleItineraryDays = async (
  newItineraryDays: NewItineraryDay[],
) => {
  const cityItineraryId = newItineraryDays[0].cityItineraryId

  const originalDates = await db
    .select()
    .from(itineraryDays)
    .where(eq(itineraryDays.cityItineraryId, cityItineraryId))

  const newDateSet = new Set(newItineraryDays.map((d) => d.date))
  const originalDateSet = new Set(originalDates.map((d) => d.date))

  const daysToInsert = newItineraryDays.filter(
    (d) => !originalDateSet.has(d.date),
  )
  const daysToRemove = originalDates.filter((d) => !newDateSet.has(d.date))

  const result = await db.transaction(async (tx) => {
    let inserted: ItineraryDay[] = []

    if (daysToInsert.length > 0) {
      ;``
      inserted = await tx
        .insert(itineraryDays)
        .values(daysToInsert.map((day) => ({ ...day, id: generateId() })))
        .returning()
    }

    if (daysToRemove.length > 0) {
      await tx.delete(itineraryDays).where(
        inArray(
          itineraryDays.id,
          daysToRemove.map((d) => d.id),
        ),
      )
    }

    return inserted
  })

  return result
}

export const deleteItineraryDay = async (id: string) => {
  const [deletedItineraryDay] = await db
    .delete(itineraryDays)
    .where(eq(itineraryDays.id, id))
    .returning()

  return deletedItineraryDay
}
