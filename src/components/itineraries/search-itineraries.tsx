import { Button } from '@/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import { useRecentCitySearches } from '@/hooks/use-recent-city-searches'
import { Link } from '@tanstack/react-router'
import { Folder, MapPin, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

export function SearchItineraries() {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const { recentSearches } = useRecentCitySearches()

  const [debouncedValue] = useDebounce(inputValue, 1000)
  const { searchResultsQuery: folderSearchResults } = useItineraryFolders({
    searchQuery: debouncedValue,
  })
  const { searchResultsQuery: citySearchResults } = useCityItineraries({
    searchQuery: debouncedValue,
  })

  const isPending = folderSearchResults.isPending || citySearchResults.isPending
  const showEmpty =
    !isPending &&
    folderSearchResults.data.length === 0 &&
    citySearchResults.data.length === 0

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
        <Command shouldFilter={false}>
          <CommandInput
            value={inputValue}
            onValueChange={setInputValue}
            placeholder="Search for an itinerary by title, city, activity, etc."
          />
          <CommandList>
            {showEmpty && <CommandEmpty>No results found.</CommandEmpty>}
            {isPending && <CommandLoading />}

            {folderSearchResults.data.length > 0 && (
              <CommandGroup heading="Folders">
                {folderSearchResults.data.map((folder) => (
                  <CommandItem
                    key={folder.id}
                    value={`folder:${folder.id}`}
                    keywords={[
                      folder.title ?? '',
                      folder.description ?? '',
                    ].filter(Boolean)}
                    onSelect={() => {
                      setOpen(false)
                      setInputValue('')
                    }}
                    asChild
                  >
                    <Link to="/itineraries/$id" params={{ id: folder.id }}>
                      <Folder />
                      {folder.title ?? 'Untitled folder'}
                      <span className="text-xs text-muted-foreground">
                        {folder.description ?? ''}
                      </span>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {citySearchResults.data.length > 0 && (
              <CommandGroup heading="Cities">
                {citySearchResults.data.map((result) => (
                  <CommandItem
                    key={result.id}
                    value={`city:${result.id}`}
                    keywords={[
                      result.title ?? '',
                      result.city,
                      result.description ?? '',
                    ].filter(Boolean)}
                    onSelect={() => {
                      setOpen(false)
                      setInputValue('')
                    }}
                    asChild
                  >
                    <Link
                      to="/itineraries/cities/$cityId"
                      params={{ cityId: result.id }}
                    >
                      <MapPin />
                      {result.title ?? `${result.city} itinerary`}{' '}
                      <span className="text-xs text-muted-foreground">
                        {result.description ?? ''}
                      </span>
                    </Link>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {recentSearches.length > 0 && (
              <CommandGroup heading="Suggestions">
                {recentSearches.map((search) => (
                  <CommandItem
                    key={search.name}
                    value={`recent:${search.name}`}
                  >
                    {search.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
