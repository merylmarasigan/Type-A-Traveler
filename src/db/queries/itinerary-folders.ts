import { generateId } from 'better-auth'
import { and, eq, getTableColumns } from 'drizzle-orm'
import type { NewItineraryFolder, UpdateItineraryFolder } from '@/db/types'
import { db } from '@/db'
import { cityItineraries, itineraryFolders } from '@/db/schema/app'

const { createdAt, updatedAt, ...itineraryFolderColumns } =
  getTableColumns(itineraryFolders)

/**
 * Get a specific amount of itinerary folders.
 * @param limit Adds a limit clause to the query. Defaults to 10.
 */
export const getItineraryFolders = async (
  limit: number = 10,
  publicOnly: boolean,
) => {
  const publicOnlyClause = publicOnly
    ? eq(itineraryFolders.isPublic, true)
    : undefined

  const result = await db
    .select(itineraryFolderColumns)
    .from(itineraryFolders)
    .where(publicOnlyClause)
    .limit(limit)

  return result
}

export const getUserItineraryFolders = async (
  userId: string,
  publicOnly: boolean,
) => {
  const publicOnlyClause = publicOnly
    ? eq(itineraryFolders.isPublic, true)
    : undefined
  const result = await db
    .select(itineraryFolderColumns)
    .from(itineraryFolders)
    .where(and(eq(itineraryFolders.authorId, userId), publicOnlyClause))

  return result
}

export const getItineraryFolder = async (id: string) => {
  const [result] = await db
    .select(itineraryFolderColumns)
    .from(itineraryFolders)
    .where(eq(itineraryFolders.id, id))
    .limit(1)

  return result
}

export const createItineraryFolder = async (
  newItineraryFolder: NewItineraryFolder,
) => {
  const [result] = await db
    .insert(itineraryFolders)
    .values({ ...newItineraryFolder, id: generateId() })
    .returning()

  return result
}

export const updateItineraryFolder = async (values: UpdateItineraryFolder) => {
  const [result] = await db
    .update(itineraryFolders)
    .set(values)
    .where(eq(itineraryFolders.id, values.id))
    .returning()

  return result
}

export const deleteItineraryFolder = async (id: string) => {
  await db.transaction(async (tx) => {
    await tx.delete(itineraryFolders).where(eq(itineraryFolders.id, id))
    await tx.delete(cityItineraries).where(eq(cityItineraries.folderId, id))
  })
}
