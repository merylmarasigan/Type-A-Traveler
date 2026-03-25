import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { LocationDetails } from '@/services/tripadvisor/schema'
import { BookmarkCheck, BookmarkPlus } from 'lucide-react'

interface SaveActivityButtonProps {
  activity: LocationDetails
  city: string
  imageUrl?: string
}
export function SaveActivityButton({
  activity,
  city,
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

    const res = await createSavedActivityMutation.mutateAsync({
      userId: data.user.id,
      name: activity.name,
      city,
      description: activity.description,
      imageUrl,
      trp_location_id: `${activity.location_id}`,
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
      className={cn(
        'flex-1 hover:cursor-pointer',
        alreadyBookmarked && 'opacity-50',
      )}
    >
      {alreadyBookmarked ? <BookmarkCheck /> : <BookmarkPlus />}
      {alreadyBookmarked ? 'Saved' : 'Save'}
    </Button>
  )
}
