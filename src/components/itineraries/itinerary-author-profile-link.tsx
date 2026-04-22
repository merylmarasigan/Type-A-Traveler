import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'

export function ItineraryAuthorProfileLink({
  authorId,
  sessionUserId,
  username,
}: {
  authorId: string
  sessionUserId: string | undefined
  username: string | null | undefined
}) {
  if (!username || sessionUserId === authorId) return null

  return (
    <Badge asChild variant="secondary">
      <Link to="/profile/$username" params={{ username }}>
        @{username}
      </Link>
    </Badge>
  )
}
