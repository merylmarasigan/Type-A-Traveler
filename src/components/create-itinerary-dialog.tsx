import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { User } from 'better-auth'
import { DateRangePicker } from '@/components/date-range-picker'

interface CreateItineraryDialogProps {
  user: User
  city: string
}

export function CreateItineraryDialog({
  user,
  city,
}: CreateItineraryDialogProps) {
  const { activitiesQuery } = useSavedActivities(user.id, city)

  if (activitiesQuery.data.length === 0) return null

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create your itinerary</Button>
      </DialogTrigger>
      <DialogContent className="w-auto sm:max-w-xl p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Create your itinerary for {city}</DialogTitle>
          <DialogDescription>
            What days will you be traveling?
          </DialogDescription>
        </DialogHeader>
        <DateRangePicker city={city} />
      </DialogContent>
    </Dialog>
  )
}
