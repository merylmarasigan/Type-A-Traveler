import { Suspense, useEffect, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Folder, MapPin, Search } from 'lucide-react'
import { useDebounce } from 'use-debounce'

import type { CityItinerary, ItineraryFolder } from '@/db/types'
import {
  Command,
  CommandDialog,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { useRecentItinerarySearches } from '@/hooks/use-recent-itinerary-searches'
import { searchCityItinerariesQueryOptions } from '@/services/backend/city-itineraries.options'
import { searchItineraryFoldersQueryOptions } from '@/services/backend/itinerary-folders.options'
import { Spinner } from '@/components/ui/spinner'

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
      className="flex flex-col mb-2 gap-1 rounded-md p-1 "
      onClick={onSelect ? onSelect : undefined}
    >
      <span className="flex items-center gap-2 line-clamp-1 text-ellipsis">
        {icon()}
        {result.title ?? 'Untitled Itinerary'}
      </span>
      {result.description && (
        <span className="text-xs line-clamp-2 text-ellipsis">
          {result.description}
        </span>
      )}
    </Link>
  )
}

function SearchItinerariesResults({
  query,
  onSelectResult,
}: {
  query: string
  onSelectResult: (result: ItineraryFolder | CityItinerary) => void
}) {
  const trimmed = query.trim()
  if (!trimmed) return null

  const folderSearchResults = useSuspenseQuery(
    searchItineraryFoldersQueryOptions(trimmed, true),
  )
  const citySearchResults = useSuspenseQuery(
    searchCityItinerariesQueryOptions(trimmed, true),
  )

  const showEmpty =
    folderSearchResults.data.length === 0 && citySearchResults.data.length === 0

  if (showEmpty) {
    return (
      <div data-slot="command-empty" className="pt-4 text-center text-sm">
        No results for "{trimmed}".
      </div>
    )
  }

  return (
    <>
      {folderSearchResults.data.length > 0 && (
        <CommandGroup heading="Folders">
          {folderSearchResults.data.map((folder) => (
            <CommandItem
              key={folder.id}
              value={`folder:${folder.id}`}
              keywords={[folder.title ?? '', folder.description ?? ''].filter(
                Boolean,
              )}
              asChild
            >
              <SearchResult
                result={folder}
                onSelect={() => onSelectResult(folder)}
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
                onSelect={() => onSelectResult(result)}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </>
  )
}

export function SearchItineraries() {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const { recentSearches, recordRecentItinerarySearch } =
    useRecentItinerarySearches()
  const [debouncedValue] = useDebounce(inputValue, 1000)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prevOpen) => !prevOpen)
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
            <Suspense
              fallback={
                <CommandLoading className="p-2">
                  <div className="flex items-center gap-2">
                    <Spinner />
                    Searching…
                  </div>
                </CommandLoading>
              }
            >
              <SearchItinerariesResults
                query={debouncedValue}
                onSelectResult={(result) => handleClick(result)}
              />
            </Suspense>

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
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  )
}
