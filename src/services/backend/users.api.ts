import {
  deleteUser,
  updateUser,
  getSingleUser,
  getUsers,
} from '@/db/queries/users'
import { updateUserSchema } from '@/db/types'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'

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
    const updatedUser = await updateUser(data)

    return updatedUser
  })

export const deleteUserFn = createServerFn({
  method: 'POST',
})
  .inputValidator(z.object({ userId: z.string() }))
  .handler(async ({ data }) => {
    const deletedUser = await deleteUser(data.userId)

    return deletedUser
  })
