import { Button } from '@/components/ui/button'
import {
  FieldError,
  FieldGroup,
  FieldLabel,
  Field,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useForm } from '@tanstack/react-form'
import z from 'zod/v4'

interface EditItineraryFormProps {
  title: string | null
  id: string
  onSubmit: (value: { title: string | null }) => Promise<void>
}

const formSchema = z.object({
  title: z.string().min(1, 'Itinerary title must be at least 1 character.'),
})

export function EditItineraryForm({ title, onSubmit }: EditItineraryFormProps) {
  const form = useForm({
    defaultValues: {
      title,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      onSubmit({ title: value.title })
      // toast.success('Title updated!')
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-2"
    >
      <FieldGroup>
        <form.Field
          name="title"
          children={(field) => {
            const isInvalid =
              field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? 'My Itinerary'}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={title ?? 'My Itinerary'}
                  aria-invalid={isInvalid}
                  autoComplete="off"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <Button type="submit">Save</Button>
    </form>
  )
}
