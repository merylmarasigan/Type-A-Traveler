import z from 'zod/v4'

export interface CityData {
  name: string
  adminName1: string
  countryName: string
}

export interface GeoNamesResult {
  geonames: CityData[]
  totalResultsCount: number
}

export const citySearchSchema = z.object({
  city: z.string('Search for a city'),
})
