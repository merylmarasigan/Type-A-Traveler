import {createFileRoute} from '@tanstack/react-router'
import {Card, CardFooter, CardHeader, CardTitle, CardDescription, CardContent} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/community')({
    component: CommunityPage
})

function CommunityPage(){
    const trips = [
    { id: 1, title: "Santa Barbara Bachelorette!", author: "Jane Doe", description: "Connect with other travelers in Santa Barbara" },
    { id: 2, title: "Napa Valley Bachelorette!", author: "Jane Smith", description: "A trip to wine country to celebrate the bride!" },
    { id: 3, title: "Japan 2026!", author: "John Doe", description: "A trip to Tokyo, Kyoto, and Osaka!" },
    { id: 4, title: "Italy 2026!", author: "Sally Johnson", description: "Living la dolce vita with Pasta, Pizza, and cappuccinos!" },
    { id: 5, title: "Cancun", author: "Shawn Michaels", description: "Vamos a la playa!" }
  ]
    return (
    <div>
      <h1 className="ml-5 mb-3 mt-5 text-7xl font-bold">Community</h1>
      <h2 className="ml-5 mb-10">See trips others have planned!</h2>
      <div className="grid grid-cols-3 gap-5 m-5">
        {trips.map((trip) => (
          <Card key={trip.id}>
            <CardHeader>
              <CardTitle>{trip.title}</CardTitle>
              <p className='text-muted-foreground text-sm'>{trip.author}</p>
              <CardDescription>{trip.description}</CardDescription>
            </CardHeader>
            <CardFooter className="justify-end">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">View</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}