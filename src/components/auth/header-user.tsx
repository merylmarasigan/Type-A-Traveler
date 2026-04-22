import { Link } from '@tanstack/react-router'
import { Bookmark, Folders, LogOutIcon } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function AuthHeader() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
    )
  }

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar>
              {session.user.image && (
                <AvatarImage src={session.user.image} alt={session.user.name} />
              )}
              <AvatarFallback>
                {session.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                to={`/profile/$username`}
                params={{ username: session.user.username ?? '' }}
                className="justify-start"
              >
                <span>{session.user.name}</span>
                <span className="text-muted-foreground">
                  @{session.user.username}
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-itineraries" className="justify-start">
                <Folders />
                My Itineraries
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/my-activities" className="justify-start">
                <Bookmark />
                My Saved Activities
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => authClient.signOut()}
          >
            <LogOutIcon />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
