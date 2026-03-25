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
import { Edit } from 'lucide-react'
import { useState } from 'react'

interface EditableItineraryTitleProps {
  title: string | null
  id: string
  type: 'Folder' | 'City'
}

export function EditableItineraryTitle(props: EditableItineraryTitleProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          className={cn(
            'h-min col-start-1 col-span-2 md:col-start-2 md:col-span-1',
            'grid grid-cols-3',
            'text-center text-4xl font-extrabold',
            'hover:cursor-pointer',
          )}
        >
          <span className="col-start-2">{props.title}</span>
          <Edit className="col-start-3 place-self-end size-6 self-center " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename {props.title}</DialogTitle>
          <DialogDescription>
            {props.type === 'Folder' ? 'Itinerary Folder' : 'City Itinerary'}
          </DialogDescription>
        </DialogHeader>
        <EditItineraryForm {...props} closeModal={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
