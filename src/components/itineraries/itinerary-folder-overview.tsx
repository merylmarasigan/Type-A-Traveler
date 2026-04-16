import { Hotel, NotepadText, PlaneTakeoff } from 'lucide-react'
import type { ItineraryFolder } from '@/db/types'
import { ItineraryNotes } from '@/components/itineraries/itinerary-notes'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TypographyH2 } from '@/components/ui/typography'

interface ItineraryFolderOverviewProps {
  folder: ItineraryFolder
}

export function ItineraryFolderOverview({
  folder,
}: ItineraryFolderOverviewProps) {
  return (
    <div className="flex flex-col gap-2">
      <TypographyH2>Overview</TypographyH2>
      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">
            <NotepadText />
            Notes
          </TabsTrigger>
          <TabsTrigger value="flights">
            <PlaneTakeoff />
            Flights
          </TabsTrigger>
          <TabsTrigger value="lodging">
            <Hotel />
            Lodging
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <ItineraryNotes id={folder.id} />
        </TabsContent>
        <TabsContent value="flights">TODO: add flights</TabsContent>
        <TabsContent value="lodging">TODO: add lodging</TabsContent>
      </Tabs>
    </div>
  )
}
