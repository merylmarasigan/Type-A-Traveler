import { SearchCities } from '@/components/search-cities'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MapPinPlus } from 'lucide-react'
import { ComponentProps } from 'react'

export function SearchCitiesDialog(props: ComponentProps<'button'>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" {...props}>
          <MapPinPlus />
          Add another city
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add another city</DialogTitle>
          <DialogDescription>Where to next?</DialogDescription>
        </DialogHeader>

        <SearchCities showFilterButtons={false} />
      </DialogContent>
    </Dialog>
  )
}
