import { Button } from '@/components/ui/button'
import {
  FieldError,
  FieldGroup,
  FieldLabel,
  Field,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useSingleCityItinerary } from '@/hooks/use-single-city-itinerary'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { useForm } from '@tanstack/react-form'
import z from 'zod/v4'

interface EditItineraryFormProps {
  title: string | null
  id: string
  type: 'Folder' | 'City'
  closeModal: () => void
}

const formSchema = z.object({
  title: z.string().min(1, 'Itinerary title must be at least 1 character.'),
})

export function EditItineraryForm({
  title,
  id,
  type,
  closeModal,
}: EditItineraryFormProps) {
  const { updateFolderMutation } = useSingleItineraryFolder(
    type === 'Folder' ? id : undefined,
  )
  const { updateItineraryMutation } = useSingleCityItinerary(
    type === 'City' ? id : undefined,
  )

  const form = useForm({
    defaultValues: {
      title,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (type === 'City') {
        await updateItineraryMutation.mutateAsync({ id, title: value.title })
      } else if (type === 'Folder') {
        await updateFolderMutation.mutateAsync({ id, title: value.title })
      }

      closeModal()

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
