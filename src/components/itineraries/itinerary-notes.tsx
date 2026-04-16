import { useForm } from '@tanstack/react-form'
import { Edit, Save, SaveOff } from 'lucide-react'
import { Suspense, useState } from 'react'
import z from 'zod/v4'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import {
  TypographyBlockquote,
  TypographyMuted,
} from '@/components/ui/typography'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { authClient } from '@/lib/auth-client'

interface ItineraryNotesProps {
  id: string
}

const formSchema = z.object({
  notes: z.string(),
})

export function ItineraryNotes(props: ItineraryNotesProps) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ItineraryNotesContent {...props} />
    </Suspense>
  )
}

function ItineraryNotesContent({ id }: ItineraryNotesProps) {
  const { folderQuery, updateFolderMutation } = useSingleItineraryFolder(id)
  const [isEditing, setIsEditing] = useState(false)
  const { data } = authClient.useSession()

  const form = useForm({
    defaultValues: {
      notes: folderQuery.data.notes,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      if (value.notes === folderQuery.data.notes) return setIsEditing(false)

      await updateFolderMutation.mutateAsync({
        id,
        notes: value.notes,
      })

      setIsEditing(false)
    },
  })

  const isOwner = data?.user.id === folderQuery.data.authorId

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        {isOwner && (
          <CardAction>
            <Button
              onClick={() => setIsEditing((prev) => !prev)}
              variant="secondary"
            >
              <Edit />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="flex flex-col gap-2"
          >
            <FieldGroup>
              <form.Field
                name="notes"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Itinerary notes
                      </FieldLabel>

                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ''}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Enter a note here"
                        className="min-h-30"
                      />
                      <FieldDescription>
                        You can add anything here. Miscellaneous notes about
                        your trip, hopes for the trip, transportation...
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>

            <div className="self-center flex items-center gap-2">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                <SaveOff />
                Cancel
              </Button>
              <Button disabled={updateFolderMutation.isPending} type="submit">
                {updateFolderMutation.isPending ? <Spinner /> : <Save />}
                {updateFolderMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </form>
        ) : !folderQuery.data.notes || folderQuery.data.notes === '' ? (
          <TypographyBlockquote className="text-muted-foreground">
            No notes yet
          </TypographyBlockquote>
        ) : (
          <TypographyMuted>{folderQuery.data.notes}</TypographyMuted>
        )}
      </CardContent>
    </Card>
  )
}
