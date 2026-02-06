import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemMedia,
} from '@/components/ui/item'
import { CityData, getCityData } from '@/data/city-data'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Building } from 'lucide-react'
import { SubmitEvent, useState } from 'react'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const [input, setInput] = useState('')
  const [data, setData] = useState<CityData[]>()
  const getCity = useServerFn(getCityData)

  const searchForCity = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const city = await getCity({ data: { city: input } })
    setData(city)
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Type A Traveler
      </h1>
      <div className=" flex flex-col justify-center">
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Create your itinerary
        </h2>
        <form onSubmit={searchForCity} className="flex gap-2 justify-between">
          <Input
            placeholder="Enter your destination"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div>
        {data?.map((d, i) => (
          <Item key={i}>
            <ItemMedia variant="icon">
              <Building />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{d.name}</ItemTitle>
              <ItemDescription>
                {d.adminName1}, {d.countryName}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button>Select</Button>
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  )
}
