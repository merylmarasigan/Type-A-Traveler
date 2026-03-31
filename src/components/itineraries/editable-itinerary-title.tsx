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
  onSubmit: (value: { title: string | null }) => Promise<void>
  className?: string
}

export function EditableItineraryTitle(props: EditableItineraryTitleProps) {
  const [open, setOpen] = useState(false)

  const handleSubmit = async (value: { title: string | null }) => {
    await props.onSubmit({ title: value.title })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="ghost"
          className={cn(
            'h-min w-full col-start-1 col-span-2 md:col-start-2 md:col-span-1',
            'flex flex-wrap justify-between items-center',
            'line-clamp-2text-center text-3xl md:text-4xl font-extrabold',
          )}
        >
          <span
            className={cn('flex-1 text-center line-clamp-1', props.className)}
          >
            {props.title}
          </span>
          <Edit className="size-6 self-center" />
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
