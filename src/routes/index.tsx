import { SearchCities } from '@/components/search-cities'
import { TypographyH1, TypographyH2 } from '@/components/ui/typography'
import { createFileRoute } from '@tanstack/react-router'
import FilterButtons from '@/components/filter-buttons'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="flex flex-col items-center justify-between gap-4">
      <TypographyH1>Type A Traveler</TypographyH1>
      <TypographyH2>Enter your destination to get started.</TypographyH2>

      <FilterButtons />
      <SearchCities />
    </div>
  )
}
