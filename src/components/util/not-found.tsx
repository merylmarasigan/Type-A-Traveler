import { Link } from '@tanstack/react-router'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { CircleUserRound } from 'lucide-react'

interface NotFoundProps {
  type?: 'user' | 'page'
}

export function NotFound({ type = 'page' }: NotFoundProps) {
  return (
    <Empty>
      <EmptyHeader>
        {type === 'user' && (
          <EmptyMedia variant="default">
            <CircleUserRound />
          </EmptyMedia>
        )}
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The {type} you&apos;re looking for doesn&apos;t exist.
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
