import { CityData } from '@/services/cities/schema'
import { ArrowRight } from 'lucide-react'

interface CitySearchResultsProps {
  cities: CityData[]
}

export function CitySearchResults({ cities }: CitySearchResultsProps) {
  return (
    <ul className="flex flex-col w-96">
      {cities.length > 0 && (
        <p className="text-muted-foreground font-bold text-xs">Cities</p>
      )}
      {cities.map((city, i) => (
        <li
          key={i}
          className="bg-card p-2 rounded-md hover:bg-muted hover:cursor-pointer flex items-center justify-between"
        >
          {city.name}
          <ArrowRight />
        </li>
      ))}
    </ul>
  )
}
