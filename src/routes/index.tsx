import { createFileRoute } from '@tanstack/react-router'
import { SearchCities } from '@/components/cities-locations/search-cities'
import { TypographyH1, TypographyH2 } from '@/components/ui/typography'
import { FeaturedItineraries } from '@/components/itineraries/featured-itineraries'
import { RecentSearches } from '@/components/cities-locations/recent-searches'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 p-2 md:p-4">
      <TypographyH1 className="text-center">Type A Traveler</TypographyH1>
      <TypographyH2 className="text-center">
        Enter your destination to get started.
      </TypographyH2>

      <SearchCities />
      <RecentSearches />
      <FeaturedItineraries />
    </div>
  )
}
