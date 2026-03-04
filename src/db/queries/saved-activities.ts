import { db } from '@/db'
import { savedActivities } from '@/db/schema/app'
import { NewSavedActivity, UpdateSavedActivity } from '@/db/types'
import { generateId } from 'better-auth'
import { eq } from 'drizzle-orm'

export const getUserSavedActivities = async (userId: string) => {
  const result = await db
    .select()
    .from(savedActivities)
    .where(eq(savedActivities.userId, userId))

  return result
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
