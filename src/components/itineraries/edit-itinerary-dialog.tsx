import { EditItineraryForm } from '@/components/itineraries/edit-itinerary-form'
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
import { FolderPen, MapPinPen } from 'lucide-react'
import { useState } from 'react'

interface EditItineraryDialogProps {
  title: string | null
  description: string | null
  id: string
  type: 'Folder' | 'City'
  onSubmit: (value: {
    title: string | null
    description: string | null
  }) => Promise<void>
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
        <EditItineraryForm {...props} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}
