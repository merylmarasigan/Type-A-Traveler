import { Link } from '@tanstack/react-router'
import { Search, SearchAlertIcon } from 'lucide-react'
import { SavedActivityPreview } from '@/components/saved-activities/saved-activity-preview'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { TypographyH3 } from '@/components/ui/typography'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { authClient } from '@/lib/auth-client'

interface UserSavedActivitiesProps {
  city: string
  lat: string
  lng: string
}

export function UserSavedActivities({
  city,
  lat,
  lng,
}: UserSavedActivitiesProps) {
  const { userActivitiesQuery } = useSavedActivities({ city })
  const { data: savedActivities } = userActivitiesQuery

  const { data } = authClient.useSession()

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex justify-between items-center">
        <TypographyH3>My saved activities</TypographyH3>
        <Button asChild>
          {/* TODO: add lat and long - perhaps save in db schema */}
          <Link
            to="/activities/$city"
            params={{ city }}
            search={{ category: 'hotels', lat, lng }}
          >
            <Search />
            Find more
          </Link>
        </Button>
      </div>
      {!data?.user ? (
        <Alert>
          <SearchAlertIcon />
          <AlertTitle>You are not signed in!</AlertTitle>
          <AlertDescription>
            Sign in to browse your saved activities.
          </AlertDescription>
        </Alert>
      ) : (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
          {savedActivities.map((activity) => (
            <SavedActivityPreview key={activity.id} id={activity.id} />
          ))}
        </ul>
      )}
    </div>
  )
}
