import { Eye, EyeOff } from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
import { useSingleItineraryFolder } from '@/hooks/use-single-itinerary-folder'

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
    <Toggle
      variant="outline"
      onClick={togglePrivacy}
      aria-label="Toggle itinerary privacy"
    >
      {isPublic ? <Eye /> : <EyeOff />}
      {isPublic ? 'Public' : 'Private'}
    </Toggle>
  )
}
