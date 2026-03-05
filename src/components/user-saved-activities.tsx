import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { TypographyH3 } from '@/components/ui/typography'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { User } from 'better-auth'
import { Search } from 'lucide-react'

interface UserSavedActivitiesProps {
  user: User
  city: string
}

export function UserSavedActivities({ user, city }: UserSavedActivitiesProps) {
  const { activitiesQuery } = useSavedActivities(user.id)
  const { data: savedActivities } = activitiesQuery

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <TypographyH3>My saved activities</TypographyH3>
        <Button asChild>
          <Link to="/activities/$city" params={{ city }}>
            <Search />
            Find more
          </Link>
        </Button>
      </div>
      <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
        {savedActivities.map((activity) => (
          <Card
            key={activity.id}
            className="relative mx-auto w-full max-w-sm max-h-fit pt-0 hover:bg-muted hover:cursor-pointer"
          >
            {activity.imageUrl && (
              <Image
                src={activity.imageUrl}
                alt={activity.name}
                layout="constrained"
                width={384}
                height={192}
                className="relative aspect-video w-full object-cover dark:brightness-40 rounded-t-md"
              />
            )}
            <CardHeader>
              <CardTitle>{activity.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {activity.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </ul>
    </div>
  )
}
