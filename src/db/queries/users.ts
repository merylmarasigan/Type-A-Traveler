import { eq } from 'drizzle-orm'
import type { UpdateUser } from '@/db/types'
import { db } from '@/db'
import { user } from '@/db/schema/auth'

/**
 * @param limit Defaults to 10
 */
export const getUsers = async (limit: number = 10) => {
  const [result] = await db.select().from(user).limit(limit)

  return result
}

export const getSingleUser = async (id: string) => {
  const [result] = await db.select().from(user).where(eq(user.id, id)).limit(1)

  return result
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
