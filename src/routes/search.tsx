import { CitySearchResults } from '@/components/city-search-results'
import { citiesQueryOptions } from '@/services/cities/query-options'
import { citySearchSchema } from '@/services/cities/schema'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search')({
  validateSearch: (search) => citySearchSchema.parse(search),
  component: RouteComponent,
})

function RouteComponent() {
  const { city } = Route.useSearch()
  const searchCitiesQuery = useSuspenseQuery(citiesQueryOptions(city))

  return <CitySearchResults cities={searchCitiesQuery.data} />
}
