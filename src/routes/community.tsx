import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useItineraryFolders } from '@/hooks/use-itinerary-folders'

export const Route = createFileRoute('/community')({
  component: CommunityPage,
})

function CommunityPage() {
  const { foldersQuery } = useItineraryFolders()
  const { data: folders } = foldersQuery

  return (
    <div>
      <h1 className="ml-5 mb-3 mt-5 text-7xl font-bold">Community</h1>
      <h2 className="ml-5 mb-10">See trips others have planned!</h2>
      <div className="grid grid-cols-3 gap-5 m-5">
        {folders.map((folder) => (
          <Card key={folder.id}>
            <CardHeader>
              <CardTitle>{folder.title}</CardTitle>
              <p className="text-muted-foreground text-sm">{folder.authorId}</p>
              <CardDescription>{folder.description}</CardDescription>
            </CardHeader>
            <CardFooter className="justify-end">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
