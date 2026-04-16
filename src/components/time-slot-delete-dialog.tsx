import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { TimeSlot } from '@/db/types'
import { useSingleTimeSlot } from '@/hooks/use-single-time-slot'
import { formatDate } from 'date-fns'
import { Trash, Trash2Icon } from 'lucide-react'

interface TimeSlotDeleteDialogProps {
  timeSlot: TimeSlot
}

export function TimeSlotDeleteDialog({ timeSlot }: TimeSlotDeleteDialogProps) {
  const { deleteTimeSlotMutation } = useSingleTimeSlot(timeSlot.id)

  const deleteTimeSlot = async () => {
    await deleteTimeSlotMutation.mutateAsync(timeSlot.id)
  }

  if (!timeSlot.startTime || !timeSlot.endTime) return null
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this time slot?</AlertDialogTitle>
          <AlertDialogDescription>
            {formatDate(timeSlot.startTime, 'p')} -{' '}
            {formatDate(timeSlot.endTime, 'p')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteTimeSlot} variant="destructive">
            <Trash />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
