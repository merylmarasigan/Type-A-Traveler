import { BookmarkCheck, BookmarkPlus } from 'lucide-react'
import { Suspense } from 'react'
import type { LocationDetails } from '@/services/tripadvisor/schema'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

interface SaveActivityButtonProps {
  activity: LocationDetails
  city: string
  lat: string
  lng: string
  imageUrl?: string
}

export function SaveActivityButton(props: SaveActivityButtonProps) {
  return (
    <Suspense
      fallback={
        <Button disabled className="flex-1">
          <Spinner />
          Save
        </Button>
      }
    >
      <SaveActivityButtonContent {...props} />
    </Suspense>
  )
}

function SaveActivityButtonContent({
  activity,
  city,
  lat,
  lng,
  imageUrl,
}: SaveActivityButtonProps) {
  const { data, isPending: authIsPending } = authClient.useSession()

  const { userActivitiesQuery, createSavedActivityMutation } =
    useSavedActivities({ city })

  const alreadyBookmarked = userActivitiesQuery.data.some(
    (a) => a.trp_location_id === `${activity.location_id}`,
  )

  const saveActivity = async () => {
    if (
      alreadyBookmarked ||
      !data?.user ||
      createSavedActivityMutation.isPending
    )
      return

    await createSavedActivityMutation.mutateAsync({
      userId: data.user.id,
      name: activity.name,
      city,
      lat,
      lng,
      description: activity.description,
      imageUrl,
      trp_location_id: `${activity.location_id}`,
      tripadvisorUrl: activity.web_url,
    })
  }

  if (authIsPending || !data?.user || createSavedActivityMutation.isPending) {
    return (
      <Button disabled className="flex-1">
        {authIsPending ? <Spinner /> : <BookmarkPlus />}
        {createSavedActivityMutation.isPending ? 'Saving...' : 'Save'}
      </Button>
    )
  }

  return (
    <Button
      onClick={saveActivity}
      disabled={alreadyBookmarked}
      className={cn('flex-1', alreadyBookmarked && 'opacity-50')}
    >
      {alreadyBookmarked ? <BookmarkCheck /> : <BookmarkPlus />}
      {alreadyBookmarked ? 'Saved' : 'Save'}
    </Button>
  )
}
