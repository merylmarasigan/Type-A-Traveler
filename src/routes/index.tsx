import { CategoryDropdown } from '@/components/category-dropdown'
import { SearchCities } from '@/components/search-cities'
import { TypographyH1, TypographyH2 } from '@/components/ui/typography'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 p-2 md:p-4">
      <TypographyH1 className="text-center">Type A Traveler</TypographyH1>
      <TypographyH2 className="text-center">
        Enter your destination to get started.
      </TypographyH2>
      <SearchCities />
    </div>
  )
}
