import { useEffect, useState } from 'react'

export type RecentCitySearch = {
  name: string
  lat: string
  lng: string
}

const STORAGE_KEY = 'type-a-traveler:recent-city-searches'
const MAX_ITEMS = 10

function parseStored(raw: string | null): Array<RecentCitySearch> {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is RecentCitySearch =>
        typeof item === 'object' &&
        item !== null &&
        'name' in item &&
        'lat' in item &&
        'lng' in item &&
        typeof (item as RecentCitySearch).name === 'string' &&
        typeof (item as RecentCitySearch).lat === 'string' &&
        typeof (item as RecentCitySearch).lng === 'string',
    )
  } catch {
    return []
  }
}

export function loadRecentCitySearches(): Array<RecentCitySearch> {
  if (typeof window === 'undefined') return []
  return parseStored(localStorage.getItem(STORAGE_KEY))
}

export function recordRecentCitySearch(entry: RecentCitySearch) {
  if (typeof window === 'undefined') return
  const existing = loadRecentCitySearches()
  const withoutDup = existing.filter((e) => e.name !== entry.name)
  const next = [entry, ...withoutDup].slice(0, MAX_ITEMS)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
}

export function useRecentCitySearches() {
  const [recentSearches, setRecentSearches] = useState<Array<RecentCitySearch>>([])

  const clearSearchHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setRecentSearches([])
  }

  useEffect(() => {
    setRecentSearches(loadRecentCitySearches())
  }, [])

  return { recentSearches, clearSearchHistory }
}
