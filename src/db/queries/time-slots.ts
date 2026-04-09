import { db } from '@/db'
import { timeSlots } from '@/db/schema/app'
import { NewTimeSlot, UpdateTimeSlot } from '@/db/types'
import { generateId } from 'better-auth'
import { eq } from 'drizzle-orm'

export const getItineraryDayTimeSlots = async (itineraryDayId: string) => {
  const result = await db
    .select()
    .from(timeSlots)
    .where(eq(timeSlots.itineraryDayId, itineraryDayId))
    .orderBy(timeSlots.startTime)

  return result
}

export const getTimeSlot = async (id: string) => {
  const [result] = await db
    .select()
    .from(timeSlots)
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
