import { sql } from 'drizzle-orm'
import { db } from '@/db'

const tables = [
  // Drop dependents first to respect foreign key constraints
  'saved_activities',
  'time_slots',
  'itinerary_days',
  'city_itineraries',
  'lodging',
  'itinerary_folders',
  'verification',
  'session',
  'account',
  'user',
]

async function reset() {
  console.log('⚠️  Resetting database...\n')

  try {
    for (const table of tables) {
      await db.execute(sql.raw(`DROP TABLE IF EXISTS "${table}" CASCADE`))
      console.log(`  🗑  Dropped table: ${table}`)
    }

    console.log('\n✅ All tables dropped.')
  } catch (error) {
    console.error('❌ Reset failed:', error)
    process.exit(1)
  }
}

reset()
