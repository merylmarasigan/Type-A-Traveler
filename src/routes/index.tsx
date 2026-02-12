import { SearchCities } from '@/components/search-cities'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="flex flex-col items-center justify-between gap-4">
      <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
        Type A Traveler
      </h1>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Enter your destination to get started.
      </h2>

      <SearchCities />
    </div>
  )
}
