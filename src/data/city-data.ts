import { createServerFn } from '@tanstack/react-start'
import z from 'zod/v4'
import { serverEnv } from '@/config/env'

export interface CityData {
  name: string
  adminName1: string
  countryName: string
}

interface GeoNamesResult {
  geonames: CityData[]
  totalResultsCount: number
}

// https://www.geonames.org/export/geonames-search.html
export const getCityData = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ city: z.string() }))
  .handler(async ({ data }) => {
    const username = serverEnv.GEONAMES_USERNAME

    const response = await fetch(
      `http://api.geonames.org/searchJSON?q=${data.city}&maxRows=10&username=${username}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    if (!response.ok) {
      throw new Error(`Failed to fetch city data for ${data.city}`)
    }

    const cityData: GeoNamesResult = await response.json()
    return cityData.geonames
  })
