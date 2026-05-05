import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { CalendarPlus, HelpCircle, MoreVertical, Users } from 'lucide-react'
import { Suspense } from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { AuthHeader } from '@/components/auth/header-user'
import { ThemeToggle } from '@/components/util/theme-toggle'
import { Button } from '@/components/ui/button'
import { QuickCreateItineraryDialog } from '@/components/itineraries/quick-create-itinerary-dialog'
import { authClient } from '@/lib/auth-client'
import { SearchItineraries } from '@/components/itineraries/search-itineraries'

function QuickCreateNavButton() {
  const { data: session } = authClient.useSession()

  if (!session?.user) return null

  return (
    <QuickCreateItineraryDialog
      trigger={
        <Button size="sm">
          <CalendarPlus />
          <span className="hidden sm:inline">New itinerary</span>
        </Button>
      }
    />
  )
}

function MobileNavMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" aria-label="More navigation">
          <MoreVertical className="text-inherit" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/community" className="cursor-pointer">
            <Users className="text-inherit" />
            Community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href="https://streethonda.github.io/tat/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HelpCircle className="text-inherit" />
            Help
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ThemeToggle />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function NavigationBar() {
  return (
    <header className="p-4 w-full">
      <div className="flex justify-between items-center w-full">
        <Button asChild variant="ghost">
          <Link to="/">
            <Image
              src="/type_a_traveler_logo.png"
              layout="constrained"
              width={192}
              height={48}
              alt="Type A Traveler"
              className="dark:invert hover:invert-30 dark:hover:invert-90"
            />
          </Link>
        </Button>
        <div className="flex items-center gap-2 md:gap-4">
          <NavigationMenu className="hidden md:block md:order-1">
            <NavigationMenuList>
              <NavigationMenuItem>
                <ThemeToggle variant="outline" />
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Button
                    asChild
                    variant="outline"
                    className="flex flex-row items-center gap-2"
                  >
                    <Link to="/community">
                      <Users className="text-inherit" />
                      Community
                    </Link>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Button
                    asChild
                    variant="outline"
                    className="flex flex-row items-center gap-2"
                  >
                    <a
                      href="https://streethonda.github.io/tat/"
                      target="_blank"
                    >
                      <HelpCircle className="text-inherit" />
                      Help
                    </a>
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Suspense fallback={null}>
            <QuickCreateNavButton />
          </Suspense>
          <SearchItineraries />

          <NavigationMenu className="order-1 md:order-2 max-w-none flex-none">
            <NavigationMenuList>
              <NavigationMenuItem>
                <AuthHeader />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="order-2 md:hidden">
            <MobileNavMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
