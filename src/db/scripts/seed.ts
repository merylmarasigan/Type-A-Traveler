import { db } from '@/db'
import {
  itineraryFolders,
  cityItineraries,
  itineraryDays,
  timeSlots,
  savedActivities,
  lodging,
} from '@/db/schema/app'
import {
  user,
  session,
  account,
  verification,
  userRelations,
  sessionRelations,
  accountRelations,
} from '@/db/schema/auth'
import {
  itinerariesRelations,
  cityItinerariesRelations,
  itineraryDaysRelations,
  timeSlotRelations,
  savedActivitiesRelations,
  lodgingRelations,
} from '@/db/schema/relations'
import { seed } from 'drizzle-seed'

async function main() {
  try {
    await seed(db, {
      user,
      session,
      account,
      verification,
      itineraryFolders,
      cityItineraries,
      itineraryDays,
      timeSlots,
      savedActivities,
      lodging,
      userRelations,
      sessionRelations,
      accountRelations,
      itinerariesRelations,
      cityItinerariesRelations,
      itineraryDaysRelations,
      timeSlotRelations,
      savedActivitiesRelations,
      lodgingRelations,
    }).refine((f) => ({
      user: {
        count: 5,
        columns: {
          id: f.uuid(),
          name: f.fullName(),
          email: f.email(),
          username: f.string({ isUnique: true }),
          displayUsername: f.string(),
          image: f.string(),
          emailVerified: f.boolean(),
        },
        with: {
          itineraryFolders: 2,
          session: 2,
          account: 1,
        },
      },

      session: {
        columns: {
          id: f.uuid(),
          token: f.string({ isUnique: true }),
          ipAddress: f.string(),
          userAgent: f.string(),
          expiresAt: f.timestamp(),
        },
      },

      account: {
        columns: {
          id: f.uuid(),
          accountId: f.string(),
          providerId: f.valuesFromArray({
            values: ['google', 'github', 'email'],
          }),
        },
      },

      verification: {
        count: 3,
        columns: {
          id: f.uuid(),
          identifier: f.email(),
          value: f.string(),
          expiresAt: f.timestamp(),
        },
      },

      itineraryFolders: {
        columns: {
          id: f.uuid(),
          title: f.valuesFromArray({
            values: [
              'Japan Spring 2025',
              'Europe Summer Trip',
              'Southeast Asia Adventure',
              'USA Road Trip',
              'South America Expedition',
              'Morocco & Spain',
            ],
          }),
        },
        with: {
          cityItineraries: 2,
          lodging: 1,
        },
      },
      description: f.valuesFromArray({
        values: [
          'Cherry blossoms, bullet trains, and ryokan stays — a springtime journey through Tokyo, Kyoto, and Hiroshima.',
          'A sun-soaked summer across Paris, Barcelona, Amsterdam, and the Amalfi Coast with friends and endless memories.',
          'Backpacking through Thailand, Vietnam, and Cambodia — street food, ancient ruins, and turquoise waters await.',
          "Coast to coast across America's most iconic highways, national parks, and roadside diners.",
          "From the Amazon rainforest to Patagonia's glaciers, an epic overland journey through the continent's wildest landscapes.",
          'Spice markets in Marrakech, flamenco in Seville, and sunsets over the Strait of Gibraltar on this dual-country escape.',
        ],
      }),
      cityItineraries: {
        columns: {
          id: f.uuid(),
          title: f.valuesFromArray({
            values: [
              '3 Days in Tokyo',
              'Weekend in Paris',
              'Exploring Bangkok',
              'NYC Highlights',
              'Kyoto Day Trips',
              'Barcelona City Guide',
              'Bali Relaxation',
              'Rome in 48 Hours',
            ],
          }),
          city: f.valuesFromArray({
            values: [
              'Tokyo',
              'Paris',
              'Bangkok',
              'New York',
              'Kyoto',
              'Barcelona',
              'Bali',
              'Rome',
            ],
          }),
          description: f.valuesFromArray({
            values: [
              "A compact itinerary covering Tokyo's top neighborhoods, hidden izakayas, and must-see landmarks in just 72 hours.",
              'Make the most of two days in the City of Light with curated stops across Montmartre, the Marais, and beyond.',
              "Navigate Bangkok's bustling streets, ornate temples, and legendary street food scene like a seasoned traveler.",
              'Hit Central Park, the High Line, world-class museums, and iconic eateries on a whirlwind tour of New York City.',
              'Discover ancient shrines, bamboo groves, and tea ceremony traditions on easy day trips from central Kyoto.',
              'From La Boqueria to the Gothic Quarter, uncover the best food, architecture, and nightlife Barcelona has to offer.',
              "Unwind on pristine beaches, indulge in spa retreats, and explore Ubud's lush rice terraces at a leisurely pace.",
              'Conquer the Colosseum, Vatican, and the finest trattorias Rome has to offer — all in a single unforgettable weekend.',
            ],
          }),
          budget: f.int({ minValue: 500, maxValue: 5000 }),
        },
        with: {
          itineraryDays: 3,
        },
      },

      itineraryDays: {
        columns: {
          id: f.uuid(),
          date: f.date({ minDate: '2025-06-01', maxDate: '2025-12-31' }),
        },
        with: {
          timeSlots: 3,
        },
      },

      timeSlots: {
        columns: {
          id: f.uuid(),
          notes: f.valuesFromArray({
            values: [
              'Book in advance',
              'Bring cash',
              'Check opening hours',
              'Dress code required',
            ],
          }),
          startTime: f.timestamp(),
          endTime: f.timestamp(),
        },
        with: {
          savedActivities: 2,
        },
      },

      savedActivities: {
        columns: {
          id: f.uuid(),
          name: f.valuesFromArray({
            values: [
              'Senso-ji Temple Visit',
              'Eiffel Tower Tour',
              'Street Food Market',
              'Museum of Modern Art',
              'Boat Tour',
              'Cooking Class',
              'Sunrise Hike',
              'Wine Tasting',
              'Historical Walking Tour',
              'Beach Day',
            ],
          }),
          description: f.loremIpsum(),
          imageUrl: f.string(),
          fsq_place_id: f.valuesFromArray({
            values: ['fsq_abc123', 'fsq_def456'],
          }),
          trp_location_id: f.valuesFromArray({
            values: ['trp_xyz789', 'trp_uvw012'],
          }),
        },
      },

      lodging: {
        columns: {
          id: f.uuid(),
          name: f.valuesFromArray({
            values: [
              'The Grand Hotel',
              'Boutique Stay Downtown',
              'Cozy Apartment Airbnb',
              'Hostel Central',
              'Marriott City Center',
              'Ryokan Sakura',
              'Vila Nova Guesthouse',
              'Beach Resort & Spa',
            ],
          }),
          address: f.streetAddress(),
        },
      },
    }))

    console.log('✅ Seed complete!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }
}

main()
