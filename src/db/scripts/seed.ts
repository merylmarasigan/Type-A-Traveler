import { generateId } from 'better-auth'
import { db } from '@/db'
import {
  cityItineraries,
  itineraryDays,
  itineraryFolders,
  lodging,
  savedActivities,
  timeSlotActivities,
  timeSlots,
} from '@/db/schema/app'
import {
  account,
  session,
  user,
  verification,
} from '@/db/schema/auth'
import {
  MOCK_LOCATION_DETAILS,
  MOCK_SEARCH_RESULTS,
  getMockPhoto,
} from '@/services/tripadvisor/__mocks__/data'

type Rng = () => number

function mulberry32(seed: number): Rng {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randInt(rng: Rng, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min
}

function pickOne<T>(rng: Rng, items: ReadonlyArray<T>): T {
  const item = items[Math.floor(rng() * items.length)]
  if (item === undefined) throw new Error('pickOne called with empty items')
  return item
}

function pickManyUnique<T>(
  rng: Rng,
  items: ReadonlyArray<T>,
  count: number,
): Array<T> {
  const copy = [...items]
  const out: Array<T> = []
  const n = Math.min(count, copy.length)
  for (let i = 0; i < n; i++) {
    const idx = Math.floor(rng() * copy.length)
    const chosen = copy[idx]
    if (chosen === undefined) break
    out.push(chosen)
    copy.splice(idx, 1)
  }
  return out
}

function toDateOnlyString(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function uniqueBy<TItem, TKey>(items: Array<TItem>, key: (t: TItem) => TKey) {
  const map = new Map<TKey, TItem>()
  for (const item of items) map.set(key(item), item)
  return [...map.values()]
}

function getAllMockCities(): Array<string> {
  const cities = new Set<string>()
  for (const key of Object.keys(MOCK_SEARCH_RESULTS)) {
    const city = key.split('-')[0]
    if (city) cities.add(city)
  }
  return [...cities]
}

function getLocationsForCity(city: string) {
  const cityResults = Object.entries(MOCK_SEARCH_RESULTS)
    .filter(([k]) => k.startsWith(`${city}-`))
    .flatMap(([, v]) => v)

  const ids = uniqueBy(
    cityResults.map((r) => String(r.location_id)),
    (id) => id,
  )

  return ids.map((id) => MOCK_LOCATION_DETAILS[id]).filter(Boolean)
}

const travelerPersonas = [
  { name: 'Mara Voss', vibe: 'runs on espresso, maps, and mild chaos' },
  { name: 'Noah Calder', vibe: 'prefers golden-hour walks and one fancy dinner' },
  { name: 'Priya Desai', vibe: 'street food maximalist with a museum habit' },
  { name: 'Elliot Park', vibe: 'books window seats and backup plans' },
  { name: 'Sofia Ortega', vibe: 'collects neighborhoods like trading cards' },
  { name: 'Jamal Rivers', vibe: 'optimizes for comfort, then breaks the rules anyway' },
  { name: 'Hannah Kline', vibe: 'chases light, sound, and weird little shops' },
  { name: 'Theo Marin', vibe: 'plans hard, wanders harder' },
  { name: 'Amara Okonkwo', vibe: 'builds trips around one perfect ritual per day' },
  { name: 'Leo Hart', vibe: 'treats jet lag like a personality trait' },
] as const

const tripBlueprints = [
  {
    title: 'Midnight Markets & Morning Light',
    description:
      'A trip built for contrast: neon alleys after dark, quiet corners at dawn, and one meal you’ll still be talking about next year.',
  },
  {
    title: 'Slow Trains, Fast Bites',
    description:
      'Move city-to-city without sprinting—leave slack for detours, pop-up exhibits, and the friend-of-a-friend recommendation that becomes the highlight.',
  },
  {
    title: 'The “One Neighborhood Deep” Week',
    description:
      'Pick a pocket of the city and learn its rhythms: the bakery line, the park bench view, the bar where everybody remembers your order.',
  },
  {
    title: 'Rain Plan, Sun Plan, Spontaneous Plan C',
    description:
      'Structured enough to feel calm, loose enough to say yes when the city offers something better than the spreadsheet.',
  },
  {
    title: 'Art, Architecture, and Accidentally Perfect Timing',
    description:
      'Museums before crowds, viewpoints at golden hour, and dinners timed so you’re never rushing with a full camera roll.',
  },
  {
    title: 'Coastal Wind + City Heat',
    description:
      'Salt air mornings, urban afternoons, and evenings that taste like citrus, smoke, and sea breeze.',
  },
  {
    title: 'The Gentle Sprint (No Heroics)',
    description:
      'A tight itinerary with humane pacing: buffers, backups, and built-in “do nothing beautifully” hours.',
  },
  {
    title: 'Bookmarks, Backstreets, and One Wild Card Day',
    description:
      'Mostly curated, one day intentionally unplanned—enough structure to feel safe, enough freedom to feel alive.',
  },
  {
    title: 'Coffee First, World Later',
    description:
      'Every day starts with a ritual cup and a short walk—then the city gets the rest of your attention.',
  },
  {
    title: 'Lights, Lenses, Late Snacks',
    description:
      'For people who travel with curiosity and a charger: cinematic skylines, small plates, and stories worth retelling.',
  },
] as const

const cityItineraryTitlePatterns = [
  (city: string) => `${city}: Notes from the Sidewalk`,
  (city: string) => `A ${city} Weekend with No Boring Meals`,
  (city: string) => `${city} in Soft Focus (Crowds Optional)`,
  (city: string) => `Three Temperatures of ${city}`,
  (city: string) => `${city} After Hours / ${city} Before Coffee`,
  (city: string) => `The ${city} Edit: Less Queue, More Curiosity`,
] as const

const cityItineraryDescriptionTemplates = [
  (city: string) =>
    `A ${city} route designed for humans, not checklists: a few anchor stops, a couple of wildcards, and space to follow whatever looks interesting.`,
  (city: string) =>
    `Think of this as a ${city} sampler—enough structure to feel grounded, enough slack to chase the smell of garlic, music, or ocean air.`,
  (city: string) =>
    `For ${city}, we’re optimizing for texture: neighborhood walks, one “splurge” moment, and at least one happy accident.`,
] as const

const cityItineraryNotes = [
  'Pack layers + a small tote for spontaneous market purchases.',
  'If you only do one thing: pick the slow option at least once.',
  'Leave one evening unscheduled—cities reward curiosity.',
  'Screenshot transit cards + save offline maps for the weird signal pockets.',
] as const

const lodgingNamePatterns = [
  (city: string) => `The ${city} Letterpress Inn`,
  (city: string) => `Room With a View (${city} Edition)`,
  (city: string) => `${city} Rooftop & Quiet Floors`,
  (city: string) => `A Very Reasonable ${city} Hideaway`,
  (city: string) => `Houseplants & High Ceilings — ${city}`,
] as const

const flightPools = [
  ['JL4', 'NH175'],
  ['BA112', 'VS4'],
  ['AF83', 'KL602'],
  ['UA857', 'DL408'],
  ['QF12', 'JQ35'],
  ['AC88', 'WS652'],
] as const

const timeSlotNoteIdeas = [
  'If lines look long, pivot—there’s usually a quieter sibling spot nearby.',
  'Book the first slot of the day if you want photos without elbows.',
  'Bring a light layer: AC is optimistic, weather is chaotic.',
  'Cash + card: some places are charmingly old-school.',
  'Hydrate like it’s a sport—you’ll walk more than you think.',
] as const

const activityNoteIdeas = [
  'Swap order with the next slot if energy dips—this one’s flexible.',
  'Ask for the server’s “if you only had one bite” pick.',
  'Leave 15 minutes early so you’re not speed-walking with snacks.',
  'Great as a sunset anchor—timing matters more than duration.',
  'If it’s crowded, do the short version and come back later.',
] as const

async function main() {
  try {
    await db.transaction(async (tx) => {
      const rng = mulberry32(42)
      const now = new Date()
      const addDays = (d: Date, days: number) =>
        new Date(d.getTime() + days * 86400000)

      const cities = getAllMockCities()
      if (cities.length === 0) throw new Error('No mock cities found')

      const userRows: Array<(typeof user.$inferInsert)> = []
      const sessionRows: Array<(typeof session.$inferInsert)> = []
      const accountRows: Array<(typeof account.$inferInsert)> = []
      const verificationRows: Array<(typeof verification.$inferInsert)> = []
      const folderRows: Array<(typeof itineraryFolders.$inferInsert)> = []
      const lodgingRows: Array<(typeof lodging.$inferInsert)> = []
      const cityItineraryRows: Array<(typeof cityItineraries.$inferInsert)> = []
      const dayRows: Array<(typeof itineraryDays.$inferInsert)> = []
      const timeSlotRows: Array<(typeof timeSlots.$inferInsert)> = []
      const savedActivityRows: Array<(typeof savedActivities.$inferInsert)> = []
      const timeSlotActivityRows: Array<(typeof timeSlotActivities.$inferInsert)> = []

      const allDetails = Object.values(MOCK_LOCATION_DETAILS)

      for (let u = 1; u <= 10; u++) {
        const userId = generateId()
        const username = `demo${u}`
        const email = `demo${u}@type-a-traveler.local`
        const persona = travelerPersonas[(u - 1) % travelerPersonas.length]

        userRows.push({
          id: userId,
          name: persona.name,
          email,
          emailVerified: true,
          username,
          displayUsername: username,
          image: null,
          showSavedActivitiesOnProfile: rng() > 0.5,
        })

        sessionRows.push({
          id: generateId(),
          userId,
          token: `seed-token-${generateId()}`,
          expiresAt: addDays(now, 30),
          ipAddress: '127.0.0.1',
          userAgent: 'seed',
        })

        accountRows.push({
          id: generateId(),
          userId,
          accountId: username,
          providerId: 'email',
        })

        verificationRows.push({
          id: generateId(),
          identifier: email,
          value: 'seed',
          expiresAt: addDays(now, 7),
        })

        const folderCount = randInt(rng, 1, 10)
        for (let f = 1; f <= folderCount; f++) {
          const folderId = generateId()
          const isPublic = rng() > 0.65
          const blueprint = pickOne(rng, tripBlueprints)
          const flavor = pickOne(rng, [
            'Atlas',
            'Harbor',
            'Lantern',
            'Jetway',
            'Postcard',
            'Compass',
            'Saffron',
            'Velvet',
          ])
          const folderTitle = `${blueprint.title} (${flavor} ${String(f).padStart(2, '0')})`
          const folderDescription = `${blueprint.description}\n\nTraveler note: ${persona.vibe}.`

          folderRows.push({
            id: folderId,
            authorId: userId,
            title: folderTitle,
            description: rng() > 0.12 ? folderDescription : null,
            flightNumbers:
              rng() > 0.55
                ? pickManyUnique(
                    rng,
                    pickOne(rng, flightPools),
                    randInt(rng, 1, 2),
                  )
                : null,
            notes:
              rng() > 0.65
                ? pickOne(rng, [
                    'Hold one “no reservations” window for serendipity.',
                    'If you’re tired, delete one stop—never delete the meal.',
                    'Pick a “north star” stop per day; everything else is negotiable.',
                  ])
                : null,
            isPublic,
          })

          if (rng() > 0.5) {
            const stayCity = pickOne(rng, cities)
            lodgingRows.push({
              id: generateId(),
              itineraryId: folderId,
              name: pickOne(rng, lodgingNamePatterns)(stayCity),
              address: rng() > 0.35 ? `${stayCity} (near the good coffee)` : null,
            })
          }

          const cityCount = randInt(rng, 1, 4)
          const folderCities = pickManyUnique(rng, cities, cityCount)
          for (const city of folderCities) {
            const locations = getLocationsForCity(city)
            const fallbackLatLng = {
              lat: String(34 + rng()),
              lng: String(-118 + rng()),
            }
            const cityCenter =
              locations.length > 0
                ? {
                    lat: String(locations[0].latitude),
                    lng: String(locations[0].longitude),
                  }
                : fallbackLatLng

            const cityItineraryId = generateId()
            cityItineraryRows.push({
              id: cityItineraryId,
              folderId,
              title:
                rng() > 0.12
                  ? null
                  : pickOne(rng, cityItineraryTitlePatterns)(city),
              description:
                rng() > 0.18
                  ? null
                  : pickOne(rng, cityItineraryDescriptionTemplates)(city),
              city,
              lat: cityCenter.lat,
              lng: cityCenter.lng,
              budget: rng() > 0.5 ? randInt(rng, 200, 6000) : null,
              notes: rng() > 0.72 ? pickOne(rng, cityItineraryNotes) : null,
            })

            const dayCount = randInt(rng, 1, 6)
            for (let d = 0; d < dayCount; d++) {
              const dayId = generateId()
              const dayDate = toDateOnlyString(
                addDays(now, randInt(rng, -10, 90) + d),
              )

              dayRows.push({
                id: dayId,
                cityItineraryId,
                date: dayDate,
              })

              const timeSlotCount = randInt(rng, 2, 4)
              for (let t = 0; t < timeSlotCount; t++) {
                const slotId = generateId()
                const start = new Date(
                  new Date(`${dayDate}T08:00:00`).getTime() +
                    t * 3 * 3600000,
                )
                const end = new Date(
                  start.getTime() + randInt(rng, 60, 150) * 60000,
                )

                timeSlotRows.push({
                  id: slotId,
                  itineraryDayId: dayId,
                  notes:
                    rng() > 0.55 ? pickOne(rng, timeSlotNoteIdeas) : null,
                  startTime: start,
                  endTime: end,
                })

                const activitiesInSlot = randInt(rng, 1, 3)
                const pickedLocations =
                  locations.length > 0
                    ? pickManyUnique(rng, locations, activitiesInSlot)
                    : []

                for (let a = 0; a < activitiesInSlot; a++) {
                  const detail =
                    pickedLocations[a] ?? pickOne(rng, allDetails)

                  const trpId = String(detail.location_id)
                  const name = detail.name
                  const savedActivityId = generateId()

                  savedActivityRows.push({
                    id: savedActivityId,
                    userId,
                    name,
                    city,
                    lat: String(detail.latitude),
                    lng: String(detail.longitude),
                    description: detail.description ?? null,
                    imageUrl: getMockPhoto(trpId, city),
                    fsq_place_id: null,
                    trp_location_id: trpId,
                  })

                  timeSlotActivityRows.push({
                    id: generateId(),
                    timeSlotId: slotId,
                    savedActivityId,
                    savedActivityName: name,
                    note: rng() > 0.45 ? pickOne(rng, activityNoteIdeas) : null,
                  })
                }
              }
            }
          }
        }
      }

      const chunked = <T>(rows: Array<T>, size: number) => {
        const out: Array<Array<T>> = []
        for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size))
        return out
      }

      const insertAll = async (table: any, rows: Array<any>, chunkSize = 500) => {
        for (const chunk of chunked(rows, chunkSize)) {
          if (chunk.length === 0) continue
          await tx.insert(table).values(chunk)
        }
      }

      await insertAll(user, userRows, 200)
      await insertAll(session, sessionRows, 500)
      await insertAll(account, accountRows, 500)
      await insertAll(verification, verificationRows, 500)
      await insertAll(itineraryFolders, folderRows, 200)
      await insertAll(lodging, lodgingRows, 200)
      await insertAll(cityItineraries, cityItineraryRows, 200)
      await insertAll(itineraryDays, dayRows, 500)
      await insertAll(timeSlots, timeSlotRows, 500)
      await insertAll(savedActivities, savedActivityRows, 200)
      await insertAll(timeSlotActivities, timeSlotActivityRows, 500)
    })

    console.log('✅ Seed complete!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

main()
