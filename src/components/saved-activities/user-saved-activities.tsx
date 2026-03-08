import { SavedActivityPreview } from '@/components/saved-activities/saved-activity-preview'
import { Button } from '@/components/ui/button'
import { TypographyH3 } from '@/components/ui/typography'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { Link } from '@tanstack/react-router'
import { User } from 'better-auth'
import { Search } from 'lucide-react'

interface UserSavedActivitiesProps {
  user: User
  city: string
}

export function UserSavedActivities({ user, city }: UserSavedActivitiesProps) {
  const { activitiesQuery } = useSavedActivities(user.id, city)
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
          <SavedActivityPreview key={activity.id} activity={activity} />
        ))}
      </ul>
    </div>
  )
}
