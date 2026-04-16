import { Link, useRouter } from '@tanstack/react-router'
import z from 'zod'
import { useForm } from '@tanstack/react-form'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { OAuthSignIn } from '@/components/auth/oauth-signin'

const formSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(20, 'Password must be at most 20 characters.'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(20, 'Username must be at most 20 characters.'),
})
type FormValues = z.infer<typeof formSchema>

const defaultFormValues: FormValues = {
  password: '',
  username: '',
}

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')

  const form = useForm({
    defaultValues: defaultFormValues,
    validators: {
      onSubmit: formSchema,
    },

    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.username(value)
      if (error) return setError(error.message ?? 'Something went wrong.')

      router.navigate({ to: '/' })
    },
  })

  return (
    <div className={cn('flex flex-col gap-6')}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <div className="flex flex-col items-center gap-2 text-center pb-2">
          <h1 className="text-xl font-bold">Welcome back!</h1>
          <FieldDescription>
            Don't have an account yet? <Link to="/signup">Create one</Link>
          </FieldDescription>
        </div>
        <FieldGroup>
          <form.Field
            name="username"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="awesome_username"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />

          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
          {error && <FieldError>{error}</FieldError>}

          <Field>
            <Button type="submit">Sign in</Button>
          </Field>

          <OAuthSignIn />
        </FieldGroup>
      </form>
    </div>
  )
}
