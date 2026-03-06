import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useSavedActivities } from '@/hooks/use-saved-activities'
import { cn } from '@/lib/utils'
import { LocationDetails } from '@/services/tripadvisor/schema'
import { User } from 'better-auth'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { ComponentProps } from 'react'

interface SaveActivityButtonProps extends ComponentProps<'button'> {
  activity: LocationDetails
  user?: User
  city: string
  imageUrl?: string
}

export function SaveActivityButton({
  user,
  city,
  className,
  ...props
}: SaveActivityButtonProps) {
  return user ? (
    <SaveActivityButtonWithSession {...props} user={user} city={city} />
  ) : (
    <Button
      disabled={props.disabled}
      className={cn('flex-1', className)}
      {...props}
    >
      <Bookmark />
      Save
    </Button>
  )
}

interface SaveActivityButtonWithSessionProps extends SaveActivityButtonProps {
  user: User
}

function SaveActivityButtonWithSession({
  activity,
  user,
  city,
  imageUrl,
  className,
  ...props
}: SaveActivityButtonWithSessionProps) {
  const { activitiesQuery, createSavedActivityMutation } = useSavedActivities(
    user.id,
    city,
  )

  const saveActivity = async () => {
    if (alreadyBookmarked || isDisabledOrPending) return

    await createSavedActivityMutation.mutateAsync({
      userId: user.id,
      name: activity.name,
      city,
      description: activity.description,
      imageUrl,
      trp_location_id: `${activity.location_id}`,
    })
  }

  const alreadyBookmarked = activitiesQuery.data.some(
    (a) => a.trp_location_id === `${activity.location_id}`,
  )

  const isDisabledOrPending =
    props.disabled || createSavedActivityMutation.isPending

  return (
    <Button
      onClick={saveActivity}
      disabled={isDisabledOrPending || alreadyBookmarked}
      className={cn(
        'flex-1 hover:cursor-pointer',
        alreadyBookmarked && 'opacity-50',
        className,
      )}
      {...props}
    >
      {isDisabledOrPending ? (
        <Spinner data-icon="inline-start" />
      ) : alreadyBookmarked ? (
        <BookmarkCheck />
      ) : (
        <Bookmark />
      )}
      {alreadyBookmarked ? 'Saved' : 'Save'}
    </Button>
  )
}
