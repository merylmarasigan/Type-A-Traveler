import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from '@/components/ui/card'
import { ItineraryFolder } from '@/db/types'
import { useCityItineraries } from '@/hooks/use-city-itineraries'
import { Link } from '@tanstack/react-router'

interface ItineraryFolderPreviewProps {
  folder: ItineraryFolder
}

export function ItineraryFolderPreview({
  folder,
}: ItineraryFolderPreviewProps) {
  const { itinerariesQuery } = useCityItineraries(folder.id)

  const cityCount = itinerariesQuery.data.length
  const multipleCities = itinerariesQuery.data.length > 1
  const firstCity = itinerariesQuery.data[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{multipleCities ? folder.title : firstCity.title}</CardTitle>
        <CardDescription>
          {multipleCities ? folder.description : firstCity.description}
        </CardDescription>
      </CardHeader>
      {multipleCities && <CardContent>{cityCount} cities</CardContent>}
      <CardFooter className="justify-end">
        <Button
          asChild
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Link to="/itineraries/$id" params={{ id: folder.id }}>
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
