import { useRecentCitySearches } from '@/hooks/use-recent-city-searches'
import { TypographyH3 } from '@/components/ui/typography'
import { Link } from '@tanstack/react-router'
import { Search, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
      <div className="flex gap-2 overflow-scroll">
        {recentSearches.map((entry) => (
          <Button
            variant="secondary"
            asChild
            key={`${entry.name}-${entry.lat}-${entry.lng}`}
          >
            <Link
              to="/activities/$city"
              params={{ city: entry.name }}
              search={{ category: 'hotels', lat: entry.lat, lng: entry.lng }}
            >
              <Search />
              {entry.name}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
