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
import { MySqlInsertBase } from 'drizzle-orm/mysql-core'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/my-itineraries')({
  component: myItinerariesPage,
})

function myItinerariesPage() {
    const{data} = authClient.useSession();
  const { userFoldersQuery } = useItineraryFolders(data?.user?.id)
  const { data: folders } = userFoldersQuery

  console.log(data?.user?.id)

  return (
    <div>
      <h1 className="ml-5 mb-3 mt-5 text-7xl font-bold">My Itineraries</h1>
      <h2 className="ml-5 mb-10">Where your past, present, and future trip plans live!</h2>
      <div className="grid grid-cols-3 gap-5 m-5">
        {folders
        .map((folder) => (
          <Card key={folder.id}>
            <CardHeader>
              <CardTitle>{folder.title}</CardTitle>
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
