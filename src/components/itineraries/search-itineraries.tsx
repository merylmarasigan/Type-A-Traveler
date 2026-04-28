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
  CommandSeparator,
} from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { CityItinerary, ItineraryFolder } from '@/db/types'
import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'
import { useRecentItinerarySearches } from '@/hooks/use-recent-itinerary-searches'
import { Link } from '@tanstack/react-router'
import { Folder, MapPin, Search, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'

function SearchResult({
  result,
  onSelect,
}: {
  result: ItineraryFolder | CityItinerary
  onSelect?: () => void
}) {
  const icon = () => ('city' in result ? <MapPin /> : <Folder />)
  const url =
    'city' in result ? `/itineraries/cities/$cityId` : `/itineraries/$id`
  const urlParams = 'city' in result ? { cityId: result.id } : { id: result.id }

  return (
    <Link
      to={url}
      params={urlParams}
      className="flex flex-col mb-2 gap-1 rounded-md p-1 hover:bg-accent"
      onClick={onSelect ? onSelect : undefined}
    >
      <span className="flex items-center gap-2 line-clamp-1 text-ellipsis">
        {icon()}
        {result.title ?? 'Untitled Itinerary'}
      </span>
      {result.description && (
        <span className="text-xs text-muted-foreground line-clamp-2 text-ellipsis">
          {result.description}
        </span>
      )}
    </Link>
  )
}

export function SearchItineraries() {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const { recentSearches, recordRecentItinerarySearch, clearSearchHistory } =
    useRecentItinerarySearches()
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

  const handleClick = (
    result: ItineraryFolder | CityItinerary,
    recordSearch: boolean = true,
  ) => {
    setOpen(false)
    setInputValue('')

    if (recordSearch) {
      recordRecentItinerarySearch({ data: result })
    }
  }

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
                    asChild
                  >
                    <SearchResult
                      result={folder}
                      onSelect={() => handleClick(folder)}
                    />
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
                    asChild
                  >
                    <SearchResult
                      result={result}
                      onSelect={() => handleClick(result)}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {recentSearches.length > 0 && (
              <CommandGroup heading="Recent Searches">
                {recentSearches.map((search) => (
                  <CommandItem
                    key={search.data.id}
                    value={`recent:${search.data.id}`}
                    asChild
                  >
                    <SearchResult
                      result={search.data}
                      onSelect={() => handleClick(search.data, false)}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {recentSearches.length > 0 && (
              <>
                <CommandSeparator />
                <CommandItem
                  onSelect={clearSearchHistory}
                  className="text-xs text-muted-foreground flex items-center gap-2"
                >
                  <SearchX />
                  Clear
                </CommandItem>
              </>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
