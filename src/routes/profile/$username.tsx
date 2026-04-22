import { TypographyH1, TypographyMuted } from '@/components/ui/typography'
import { NotFound } from '@/components/util/not-found'
import { useSingleUser } from '@/hooks/use-single-user'
import { getUserIdByUsernameFn } from '@/services/backend/users.api'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { Suspense } from 'react'

export const Route = createFileRoute('/profile/$username')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const userId = await getUserIdByUsernameFn({
      data: { username: params.username },
    })
    if (!userId) throw notFound()

    return { userId }
  },
  notFoundComponent: () => <NotFound type="user" />,
})

function RouteComponent() {
  const { userId } = Route.useLoaderData()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouteContent userId={userId} />
    </Suspense>
  )
}

function RouteContent({ userId }: { userId: string }) {
  const { userQuery } = useSingleUser({ userId })
  return (
    <div>
      <TypographyH1>{userQuery.data.name}</TypographyH1>
      <TypographyMuted className="text-center">
        @{userQuery.data.username}
      </TypographyMuted>
    </div>
  )
}
