import { eq, getTableColumns } from 'drizzle-orm'
import type { UpdateUser } from '@/db/types'
import { db } from '@/db'
import { user } from '@/db/schema/auth'

const { createdAt, updatedAt, ...userColumns } = getTableColumns(user)

/**
 * @param limit Defaults to 10
 */
export const getUsers = async (limit: number = 10) => {
  const [result] = await db.select(userColumns).from(user).limit(limit)

  return result
}

export const getSingleUser = async (id: string) => {
  const [result] = await db
    .select(userColumns)
    .from(user)
    .where(eq(user.id, id))
    .limit(1)

  return result
}

export const getUserIdByUsername = async (username: string) => {
  const result = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(user.username, username))
    .limit(1)

  return { userId: result.length > 0 ? result[0].id : null }
}

export const updateUser = async (values: UpdateUser) => {
  const [result] = await db
    .update(user)
    .set(values)
    .where(eq(user.id, values.id))
    .returning()

  return result
}

export const deleteUser = async (id: string) => {
  const [result] = await db.delete(user).where(eq(user.id, id)).returning()

  return result
}
