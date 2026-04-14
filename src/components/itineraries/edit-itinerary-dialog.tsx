import { FolderPen, MapPinPen, Trash, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { EditItineraryForm } from '@/components/itineraries/edit-itinerary-form'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface EditItineraryDialogProps {
  title: string | null
  description: string | null
  id: string
  type: 'Folder' | 'City'
  onSubmit: (value: {
    title: string | null
    description: string | null
  }) => Promise<void>
  onDelete: () => Promise<void>
  className?: string
}

export function EditItineraryDialog(props: EditItineraryDialogProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (value: {
    title: string | null
    description: string | null
  }) => {
    await props.onSubmit({ title: value.title, description: value.description })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className={cn(props.className)}
        >
          {props.type === 'Folder' ? <FolderPen /> : <MapPinPen />}
          Edit details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename {props.title}</DialogTitle>
          <DialogDescription>
            {props.type === 'Folder' ? 'Itinerary Folder' : 'City Itinerary'}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <EditItineraryForm {...props} onSubmit={handleSubmit} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash />
                Delete {props.type}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                  <Trash2Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>Delete "{props.title}"?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the {props.type.toLowerCase()}{' '}
                  and any data within the {props.type.toLowerCase()}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={props.onDelete}
                  variant="destructive"
                >
                  <Trash />
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  )
}
