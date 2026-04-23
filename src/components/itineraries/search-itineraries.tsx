import { Button } from '@/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { useRecentCitySearches } from '@/hooks/use-recent-city-searches'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'

export function SearchItineraries() {
  const [open, setOpen] = useState(false)
  const { recentSearches } = useRecentCitySearches()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        <Search />
        <span className="hidden sm:inline">
          <span className="mr-4">Search</span>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Search for an itinerary by title, city, activity, etc." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {recentSearches.map((search) => (
                <CommandItem key={search.name}>{search.name}</CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
