import { Link } from '@tanstack/react-router'
import { Search, SearchX } from 'lucide-react'
import { useRecentCitySearches } from '@/hooks/use-recent-city-searches'
import { TypographyH3 } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

export function RecentSearches() {
  const { recentSearches, clearSearchHistory } = useRecentCitySearches()

  if (recentSearches.length === 0) return null

  return (
    <div className="self-center w-full min-w-0 max-w-full md:max-w-5xl flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <TypographyH3>Recent Searches</TypographyH3>
        <Button variant="secondary" onClick={clearSearchHistory}>
          <SearchX />
          Clear
        </Button>
      </div>
      <div className="relative w-full min-w-0">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-background to-transparent" />
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-4">
            {recentSearches.map((entry) => (
              <Button
                variant="secondary"
                asChild
                key={`${entry.name}-${entry.lat}-${entry.lng}`}
              >
                <Link
                  to="/activities/$city"
                  params={{ city: entry.name }}
                  search={{
                    category: 'hotels',
                    lat: entry.lat,
                    lng: entry.lng,
                  }}
                >
                  <Search />
                  {entry.name}
                </Link>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  )
}
