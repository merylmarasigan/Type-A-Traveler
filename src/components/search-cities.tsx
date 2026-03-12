import { FilterButtons } from '@/components/filter-buttons'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { InputGroupAddon } from '@/components/ui/input-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { citiesQueryOptions } from '@/services/cities/query-options'
import { CityData } from '@/services/cities/schema'
import { LocationCategory } from '@/services/tripadvisor/api'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { GlobeIcon } from 'lucide-react'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

interface SearchCitiesProps {
  showFilterButtons?: boolean
}

export function SearchCities({ showFilterButtons = true }: SearchCitiesProps) {
  const [searchCategory, setSearchCategory] =
    useState<LocationCategory>('hotels')
  const [inputValue, setInputValue] = useState('')
  const [debouncedValue] = useDebounce(inputValue, 1000)

  const { data: cities, isLoading } = useQuery(
    citiesQueryOptions(debouncedValue),
  )

  return (
    <div className="flex flex-col items-center gap-2">
      {showFilterButtons && (
        <FilterButtons
          currentCategory={searchCategory}
          setCurrentCategory={setSearchCategory}
        />
      )}
      <Combobox
        items={cities}
        itemToStringValue={(city: CityData) => city.name}
        autoHighlight
      >
        <ComboboxInput
          placeholder="Los Angeles, New York, etc."
          className="w-ful md:w-96"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          showClear
        >
          <InputGroupAddon>
            <GlobeIcon />
          </InputGroupAddon>
        </ComboboxInput>
        <ComboboxContent>
          <ComboboxEmpty>
            {isLoading ? 'Searching...' : 'No cities found.'}
          </ComboboxEmpty>
          <ComboboxList>
            {(city: CityData, i) => (
              <Link
                key={i}
                to="/activities/$city"
                params={{ city: city.name }}
                search={{
                  category: searchCategory,
                  lat: city.lat,
                  lng: city.lng,
                }}
              >
                <ComboboxItem value={city}>
                  <Item size="sm" className="p-0">
                    <ItemContent>
                      <ItemTitle className="whitespace-nowrap">
                        {city.name}
                      </ItemTitle>
                      <ItemDescription>
                        {city.adminName1} ({city.countryName})
                      </ItemDescription>
                    </ItemContent>
                  </Item>
                </ComboboxItem>
              </Link>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
