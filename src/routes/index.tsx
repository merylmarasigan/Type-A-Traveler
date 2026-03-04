import { SearchCities } from '@/components/search-cities'
import { TypographyH1, TypographyH2 } from '@/components/ui/typography'
import { createFileRoute } from '@tanstack/react-router'
import { FilterButtons } from '@/components/filter-buttons'
import { useState } from 'react'
import { LocationCategory } from '@/services/tripadvisor/api'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [searchCategory, setSearchCategory] =
    useState<LocationCategory>('hotels')

  return (
    <div className="flex flex-col items-center justify-between gap-4">
      <TypographyH1>Type A Traveler</TypographyH1>
      <TypographyH2>Enter your destination to get started.</TypographyH2>

      <FilterButtons
        currentCategory={searchCategory}
        setCurrentCategory={setSearchCategory}
      />
      <SearchCities category={searchCategory} />
    </div>
  )
}
