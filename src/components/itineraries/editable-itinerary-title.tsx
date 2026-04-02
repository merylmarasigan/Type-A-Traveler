import { EditItineraryForm } from '@/components/itineraries/edit-itinerary-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TypographyH1, TypographyH2 } from '@/components/ui/typography'
import { cn } from '@/lib/utils'
import { Edit } from 'lucide-react'
import { useState } from 'react'

interface EditableItineraryTitleProps {
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

export function EditableItineraryTitle(props: EditableItineraryTitleProps) {
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
        <div
          className={cn(
            'grid auto-cols-auto gap-1 justify-items-start',
            'hover:bg-accent hover:cursor-pointer hover:text-accent-foreground dark:hover:bg-accent/50',
          )}
          onClick={() => setOpen(true)}
        >
          <TypographyH1 className="self-start text-start line-clamp-1">
            {props.title}
          </TypographyH1>
          <Edit className="col-start-2 justify-self-end self-center" />
          {props.description && (
            <TypographyH2 className="row-start-2 line-clamp-2">
              {props.description}
            </TypographyH2>
          )}
        </div>
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
