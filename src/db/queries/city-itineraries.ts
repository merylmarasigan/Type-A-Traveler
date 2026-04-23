import { generateId } from 'better-auth'
import { eq, getTableColumns, sql } from 'drizzle-orm'
import type { NewCityItinerary, UpdateCityItinerary } from '@/db/types'
import { db } from '@/db'
import {
  cityItineraries,
  itineraryDays,
  itineraryFolders,
  timeSlotActivities,
  timeSlots,
} from '@/db/schema/app'

const { createdAt, updatedAt, search, ...cityItineraryColumns } =
  getTableColumns(cityItineraries)

export const getFolderCityItineraries = async (folderId: string) => {
  const result = await db
    .select({
      ...cityItineraryColumns,
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
      ...cityItineraryColumns,
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

export const searchCityItinerariesByTitleAndCity = async (query: string) => {
  const result = await db
    .select({ ...cityItineraryColumns, authorId: itineraryFolders.authorId })
    .from(cityItineraries)
    .innerJoin(
      itineraryFolders,
      eq(cityItineraries.folderId, itineraryFolders.id),
    )
    .where(
      sql`${cityItineraries.search} @@ websearch_to_tsquery('english', ${query})`,
    )

  return result
}

export const searchCityItinerariesByActivities = async (query: string) => {
  const result = await db
    .select({ ...cityItineraryColumns, authorId: itineraryFolders.authorId })
    .from(cityItineraries)
    .innerJoin(
      itineraryFolders,
      eq(cityItineraries.folderId, itineraryFolders.id),
    )
    .innerJoin(
      itineraryDays,
      eq(itineraryDays.cityItineraryId, cityItineraries.id),
    )
    .innerJoin(timeSlots, eq(timeSlots.itineraryDayId, itineraryDays.id))
    .innerJoin(
      timeSlotActivities,
      eq(timeSlotActivities.timeSlotId, timeSlots.id),
    )
    .where(
      sql`${timeSlotActivities.search} @@ websearch_to_tsquery('english', ${query})`,
    )

  const uniqueById = new Map<string, (typeof result)[number]>()
  for (const row of result) uniqueById.set(row.id, row)

  return [...uniqueById.values()]
}

export const searchCityItineraries = async (query: string) => {
  const res = await Promise.all([
    searchCityItinerariesByTitleAndCity(query),
    searchCityItinerariesByActivities(query),
  ])

  const uniqueById = new Map<
    string,
    (typeof res)[0][number] & (typeof res)[1][number]
  >()
  for (const row of res[0]) uniqueById.set(row.id, row)
  for (const row of res[1]) uniqueById.set(row.id, row)

  return [...uniqueById.values()]
}
