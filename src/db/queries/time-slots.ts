import { generateId } from 'better-auth'
import { eq, getTableColumns } from 'drizzle-orm'
import type { NewTimeSlot, UpdateTimeSlot } from '@/db/types'
import { db } from '@/db'
import {
  cityItineraries,
  itineraryDays,
  itineraryFolders,
  timeSlots,
} from '@/db/schema/app'

export const getItineraryDayTimeSlots = async (itineraryDayId: string) => {
  const result = await db
    .select({
      ...getTableColumns(timeSlots),
      authorId: itineraryFolders.authorId,
    })
    .from(timeSlots)
    .innerJoin(itineraryDays, eq(timeSlots.itineraryDayId, itineraryDays.id))
    .innerJoin(
      cityItineraries,
      eq(itineraryDays.cityItineraryId, cityItineraries.id),
    )
    .innerJoin(
      itineraryFolders,
      eq(cityItineraries.folderId, itineraryFolders.id),
    )
    .where(eq(timeSlots.itineraryDayId, itineraryDayId))

  return result
}

export const getTimeSlot = async (id: string) => {
  const [result] = await db
    .select({
      ...getTableColumns(timeSlots),
      authorId: itineraryFolders.authorId,
    })
    .from(timeSlots)
    .innerJoin(itineraryDays, eq(timeSlots.itineraryDayId, itineraryDays.id))
    .innerJoin(
      cityItineraries,
      eq(itineraryDays.cityItineraryId, cityItineraries.id),
    )
    .innerJoin(
      itineraryFolders,
      eq(cityItineraries.folderId, itineraryFolders.id),
    )
    .where(eq(timeSlots.id, id))
    .limit(1)

  return result
}

export const createTimeSlot = async (newTimeSlot: NewTimeSlot) => {
  const [result] = await db
    .insert(timeSlots)
    .values({ ...newTimeSlot, id: generateId() })
    .returning()

  return result
}

export const updateTimeSlot = async (values: UpdateTimeSlot) => {
  const [result] = await db
    .update(timeSlots)
    .set(values)
    .where(eq(timeSlots.id, values.id))
    .returning()

  return result
}

export const deleteTimeSlot = async (id: string) => {
  const [deletedTimeSlot] = await db
    .delete(timeSlots)
    .where(eq(timeSlots.id, id))
    .returning()

  return deletedTimeSlot
}
