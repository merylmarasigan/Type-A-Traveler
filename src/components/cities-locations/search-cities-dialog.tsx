import { MapPinPlus } from 'lucide-react'
import type { ComponentProps } from 'react'
import { SearchCities } from '@/components/cities-locations/search-cities'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export function SearchCitiesDialog(props: ComponentProps<'button'>) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" {...props}>
            <MapPinPlus />
            Add another city
          </Button>
        }
      />
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
