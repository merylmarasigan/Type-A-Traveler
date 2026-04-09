import { Button } from '@/components/ui/button'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { TypographyLarge } from '@/components/ui/typography'
import { authClient } from '@/lib/auth-client'
import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { User } from 'better-auth'
import { Bookmark, Folders, LogOut } from 'lucide-react'
import { HoverCard as HoverCardPrimitive } from 'radix-ui'
import { ComponentProps } from 'react'

interface AuthHeaderHoverProps extends ComponentProps<
  typeof HoverCardPrimitive.Root
> {
  user: User
}

function AuthHeaderHover({ user, children }: AuthHeaderHoverProps) {
  return (
    <HoverCard openDelay={100}>
      <HoverCardTrigger>{children}</HoverCardTrigger>
      <HoverCardContent className="flex flex-col gap-2">
        <TypographyLarge>{user.name}</TypographyLarge>
        <Button asChild variant="link">
          <Link to="/my-itineraries" className="justify-start">
            <Folders />
            My Itineraries
          </Link>
        </Button>
        <Button variant="link" className="justify-start">
          {/* TODO: implement the saved-activities page */}
          {/* <Link to="/my-saved-activities" className="justify-start"> */}
          <Bookmark />
          My Saved Activities
          {/* </Link> */}
        </Button>
        <Button variant="destructive" onClick={() => authClient.signOut()}>
          <LogOut />
          Sign out
        </Button>
      </HoverCardContent>
    </HoverCard>
  )
}

export function AuthHeader() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    )
  }

  if (session?.user) {
    return (
      <AuthHeaderHover user={session.user}>
        <div className="flex items-center gap-2">
          {session.user.image ? (
            <Image
              src={session.user.image}
              layout="constrained"
              width={32}
              height={32}
              alt={session.user.image}
              className="rounded-full"
            />
          ) : (
            <div className="h-8 w-8 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center rounded-full">
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>
      </AuthHeaderHover>
    )
  }

  return (
    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
      <Link to="/login" className={navigationMenuTriggerStyle()}>
        Sign up
      </Link>
    </NavigationMenuLink>
  )
}
