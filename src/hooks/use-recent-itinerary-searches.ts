import { CityItinerary, ItineraryFolder } from '@/db/types'
import { useEffect, useState } from 'react'

export type RecentItinerarySearch = {
  data: ItineraryFolder | CityItinerary
}

const STORAGE_KEY = 'type-a-traveler:recent-itinerary-searches'
const MAX_ITEMS = 10

function parseStored(raw: string | null): RecentItinerarySearch[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is RecentItinerarySearch =>
        typeof item === 'object' && item !== null && 'data' in item,
    )
  } catch {
    return []
  }
}

export function loadRecentItinerarySearches(): RecentItinerarySearch[] {
  if (typeof window === 'undefined') return []
  return parseStored(localStorage.getItem(STORAGE_KEY))
}

export function useRecentItinerarySearches() {
  const [recentSearches, setRecentSearches] = useState<RecentItinerarySearch[]>(
    [],
  )

  const recordRecentItinerarySearch = (entry: RecentItinerarySearch) => {
    if (typeof window === 'undefined') return
    const existing = loadRecentItinerarySearches()
    const withoutDup = existing.filter((e) => e.data.id !== entry.data.id)
    const next = [entry, ...withoutDup].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setRecentSearches(next)
  }

  const clearSearchHistory = () => {
    localStorage.removeItem(STORAGE_KEY)
    setRecentSearches([])
  }

  useEffect(() => {
    setRecentSearches(loadRecentItinerarySearches())
  }, [])

  return { recentSearches, clearSearchHistory, recordRecentItinerarySearch }
}
