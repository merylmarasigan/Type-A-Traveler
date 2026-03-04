import { db } from '@/db'
import { lodging } from '@/db/schema/app'
import { NewLodging, UpdateLodging } from '@/db/types'
import { generateId } from 'better-auth'
import { eq } from 'drizzle-orm'

export const getItineraryLodging = async (itineraryFolderId: string) => {
  const result = await db
    .select()
    .from(lodging)
    .where(eq(lodging.itineraryId, itineraryFolderId))

  return result
}

export const getLodging = async (id: string) => {
  const [result] = await db
    .select()
    .from(lodging)
    .where(eq(lodging.id, id))
    .limit(1)

  return result
}

export const createLodging = async (newLodging: NewLodging) => {
  const [result] = await db
    .insert(lodging)
    .values({ ...newLodging, id: generateId() })
    .returning()

  return result
}

export const updateLodging = async (values: UpdateLodging) => {
  const [result] = await db
    .update(lodging)
    .set(values)
    .where(eq(lodging.id, values.id))
    .returning()

  return result
}

export const deleteLodging = async (id: string) => {
  const [result] = await db
    .delete(lodging)
    .where(eq(lodging.id, id))
    .returning()

  return result
}
