export interface CityData {
  name: string
  adminName1: string
  countryName: string
}

export interface GeoNamesResult {
  geonames: CityData[]
  totalResultsCount: number
}
