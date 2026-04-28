import { Suspense, useState } from 'react'
import { Image } from '@unpic/react'
import { MapPinX, MessageSquare, Pencil, Plus } from 'lucide-react'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
  timeSlotActivityQueryOptions,
  unlinkActivityFromTimeSlotMutationOptions,
  updateTimeSlotActivityNoteMutationOptions,
} from '@/services/backend/saved-activities.options'
import { authClient } from '@/lib/auth-client'

interface TimeSlotActivityCardProps {
  timeSlotActivityId: string
  savedActivityId?: string
  name: string
  description?: string
  imageUrl?: string
  timeSlotId: string
  cityItineraryId: string
  city: string
}

export function TimeSlotActivityCard(props: TimeSlotActivityCardProps) {
  return (
    <Suspense fallback={<TimeSlotActivityCardSkeleton />}>
      <TimeSlotActivityCardContent {...props} />
    </Suspense>
  )
}

export function TimeSlotActivityCardSkeleton() {
  return (
    <Card className="pt-0 max-w-sm">
      <Skeleton className="aspect-video w-full rounded-t-md rounded-b-none" />
      <CardHeader>
        <Skeleton className="h-5 w-1/2" />
        <CardDescription>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-3/4" />
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

function TimeSlotActivityCardContent({
  timeSlotActivityId,
  name,
  description,
  imageUrl,
  timeSlotId,
  cityItineraryId,
  city,
}: TimeSlotActivityCardProps) {
  const { data: session } = authClient.useSession()
  const [isEditingNote, setIsEditingNote] = useState(false)
  const [noteInput, setNoteInput] = useState('')

  const { data: timeSlotActivity } = useSuspenseQuery(
    timeSlotActivityQueryOptions({ timeSlotActivityId }),
  )

  const unlinkMutation = useMutation(
    unlinkActivityFromTimeSlotMutationOptions({
      timeSlotId,
      cityItineraryId,
      userId: session?.user.id ?? '',
      city,
    }),
  )

  const noteMutation = useMutation(
    updateTimeSlotActivityNoteMutationOptions({
      timeSlotActivityId,
    }),
  )

  const existingNote = timeSlotActivity?.note ?? null

  const handleEditNote = () => {
    setNoteInput(existingNote ?? '')
    setIsEditingNote(true)
  }

  const handleCancelNote = () => {
    setIsEditingNote(false)
    setNoteInput('')
  }

  const handleSaveNote = async () => {
    if (!timeSlotActivity) return

    await noteMutation.mutateAsync(
      { id: timeSlotActivity.id, note: noteInput.trim() || null },
      { onSuccess: () => setIsEditingNote(false) },
    )
  }

  const handleDeleteNote = async () => {
    if (!timeSlotActivity) return

    await noteMutation.mutateAsync(
      { id: timeSlotActivity.id, note: null },
      { onSuccess: () => setIsEditingNote(false) },
    )
  }

  const isOwner = !!session?.user.id

  const NoteActions = () => {
    if (!isOwner) return null

    return isEditingNote ? (
      <div className="flex flex-col gap-2">
        <Textarea
          autoFocus
          placeholder="Add a note…"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          className="min-h-[72px] resize-none text-sm"
        />
        <div className="flex justify-end gap-2">
          {existingNote && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteNote}
              disabled={noteMutation.isPending}
              className="text-destructive hover:text-destructive"
            >
              Delete
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelNote}
            disabled={noteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSaveNote}
            disabled={noteMutation.isPending}
          >
            Save
          </Button>
        </div>
      </div>
    ) : (
      !existingNote && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={handleEditNote}
        >
          <Plus className="h-3.5 w-3.5" />
          Add a note
        </Button>
      )
    )
  }

  return (
    <Card className="pt-0 max-w-sm">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={name}
          layout="constrained"
          width={384}
          height={192}
          className="relative aspect-video w-full object-cover rounded-t-md"
        />
      )}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
        {isOwner && (
          <CardAction>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => unlinkMutation.mutate(timeSlotActivityId)}
              disabled={unlinkMutation.isPending || !timeSlotActivityId}
            >
              <MapPinX />
            </Button>
          </CardAction>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-2 pt-0">
        {existingNote && !isEditingNote && (
          <div className="relative ml-1 mt-1">
            <div className="absolute -top-2 left-3 h-0 w-0 border-x-8 border-b-8 border-x-transparent border-b-muted" />
            <div className="flex items-start gap-2 rounded-lg rounded-tl-none bg-muted px-3 py-2">
              <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <p className="text-sm text-foreground">{existingNote}</p>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto -mr-1 h-6 w-6 shrink-0"
                  onClick={handleEditNote}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        )}

        <NoteActions />
      </CardContent>
    </Card>
  )
}
