import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod/v4'
import { LoginForm } from '@/components/auth/login-form'

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  const { redirect } = Route.useSearch()

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm redirect={redirect} />
      </div>
    </div>
  )
}
