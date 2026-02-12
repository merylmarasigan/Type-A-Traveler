import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CityData, getCitiesFn } from '@/data/city-data'
import { useServerFn } from '@tanstack/react-start'
import { ArrowRight } from 'lucide-react'
import { SubmitEvent, useRef, useState } from 'react'

export function SearchCities() {
  const getCitiesServerFn = useServerFn(getCitiesFn)
  const queryRef = useRef<HTMLInputElement>(null)

  const [results, setResults] = useState<CityData[]>([])

  const searchForCities = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!queryRef.current) return
    if (queryRef.current.value === '') return setResults([])

    const res = await getCitiesServerFn({
      data: { city: queryRef.current.value },
    })

    setResults(res)
  }

  return (
    <>
      <form
        onSubmit={searchForCities}
        className="w-96 flex items-center justify-between gap-2 md:gap-4"
      >
        <Field>
          <Input
            id="near"
            placeholder="Los Angeles, New York, etc."
            ref={queryRef}
            className="w-full"
          />
        </Field>

        <Button type="submit">Search</Button>
      </form>

      <ul className="flex flex-col w-96">
        {results.length > 0 && (
          <p className="text-muted-foreground font-bold text-xs">Cities</p>
        )}
        {results.map((city, i) => (
          <li
            key={i}
            className="bg-card p-2 rounded-md hover:bg-muted hover:cursor-pointer flex items-center justify-between"
          >
            {city.name}
            <ArrowRight />
          </li>
        ))}
      </ul>
    </>
  )
}
