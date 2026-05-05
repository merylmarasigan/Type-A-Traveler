import { Link } from '@tanstack/react-router'
import { CircleUserRound, EyeOff } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

interface NotFoundProps {
  type?: 'user' | 'page' | 'private-itinerary'
}

export function NotFound({ type = 'page' }: NotFoundProps) {
  return (
    <Empty>
      <EmptyHeader>
        {type === 'user' ? (
          <EmptyMedia variant="default">
            <CircleUserRound />
          </EmptyMedia>
        ) : type === 'private-itinerary' ? (
          <EmptyMedia>
            <EyeOff />
          </EmptyMedia>
        ) : null}
        <EmptyTitle>
          {type === 'private-itinerary'
            ? 'This itinerary is private.'
            : '404 - Not Found'}
        </EmptyTitle>
        <EmptyDescription>
          {type === 'private-itinerary'
            ? 'Ask the author to make it public.'
            : `The ${type} you're looking for doesn't exist.`}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          <Link to="/">Go to home page</Link>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}
