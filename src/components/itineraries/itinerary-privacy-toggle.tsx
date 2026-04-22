import { Button } from '@/components/ui/button'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'
import { Eye, EyeOff } from 'lucide-react'

interface ItineraryPrivacyToggleProps {
  isPublic: boolean
  itineraryFolderId: string
}

export function ItineraryPrivacyToggle({
  isPublic,
  itineraryFolderId,
}: ItineraryPrivacyToggleProps) {
  const { updateFolderMutation } = useSingleItineraryFolder({
    itineraryFolderId,
  })

  const togglePrivacy = async () => {
    await updateFolderMutation.mutateAsync({
      id: itineraryFolderId,
      isPublic: !isPublic,
    })
  }

  return (
    <Button
      variant="outline"
      onClick={togglePrivacy}
      aria-label={isPublic ? 'Make itinerary private' : 'Make itinerary public'}
    >
      {isPublic ? <Eye /> : <EyeOff />}
    </Button>
  )
}
