import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'
import {
  deleteUser,
  getSingleUser,
  getUsers,
  updateUser,
} from '@/db/queries/users'
import { updateUserSchema } from '@/db/types'
import { ensureSession } from '@/services/backend/auth.functions'

export const getUsersFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const users = await getUsers()

    return users
  },
)
export const getSingleUserFn = createServerFn({ method: 'GET' })
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const user = await getSingleUser(data.userId)

    return user
  })

export const updateUserFn = createServerFn({ method: 'POST' })
  .inputValidator(updateUserSchema)
  .handler(async ({ data }) => {
    await ensureSession()

    const updatedUser = await updateUser(data)

    return updatedUser
  })

export const deleteUserFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    await ensureSession()

    const deletedUser = await deleteUser(data.userId)

    return deletedUser
  })
