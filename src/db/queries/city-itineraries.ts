import { generateId } from 'better-auth'
import { eq, getTableColumns } from 'drizzle-orm'
import type { NewCityItinerary, UpdateCityItinerary } from '@/db/types'
import { db } from '@/db'
import { cityItineraries, itineraryFolders } from '@/db/schema/app'

export const getFolderCityItineraries = async (folderId: string) => {
  const result = await db
    .select({
      ...getTableColumns(cityItineraries),
      authorId: itineraryFolders.authorId,
    })
    .from(cityItineraries)
    .innerJoin(
      itineraryFolders,
      eq(cityItineraries.folderId, itineraryFolders.id),
    )
    .where(eq(cityItineraries.folderId, folderId))

  return result
}

export const getCityItinerary = async (id: string) => {
  const [result] = await db
    .select({
      ...getTableColumns(cityItineraries),
      authorId: itineraryFolders.authorId,
    })
    .from(cityItineraries)
    .innerJoin(
      itineraryFolders,
      eq(cityItineraries.folderId, itineraryFolders.id),
    )
    .where(eq(cityItineraries.id, id))
    .limit(1)

  return result
}

export const createCityItinerary = async (
  newCityItinerary: NewCityItinerary,
) => {
  const [result] = await db
    .insert(cityItineraries)
    .values({ ...newCityItinerary, id: generateId() })
    .returning()

  return result
}

export const updateCityItinerary = async (values: UpdateCityItinerary) => {
  const [result] = await db
    .update(cityItineraries)
    .set(values)
    .where(eq(cityItineraries.id, values.id))
    .returning()

  return result
}

export const deleteCityItinerary = async (id: string) => {
  const [deletedCityItinerary] = await db
    .delete(cityItineraries)
    .where(eq(cityItineraries.id, id))
    .returning()

  const remainingCities = await db
    .select()
    .from(cityItineraries)
    .where(eq(cityItineraries.folderId, deletedCityItinerary.folderId))

  if (remainingCities.length === 0) {
    await db
      .delete(itineraryFolders)
      .where(eq(itineraryFolders.id, deletedCityItinerary.folderId))
  }

  return { deletedCityItinerary, remainingCities }
}
