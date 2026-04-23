import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { Moon, Sun, Building2, CalendarPlus, MoreVertical } from 'lucide-react'
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
import { useTheme } from '@/components/util/theme-provider'
import { Button } from '@/components/ui/button'
import { QuickCreateItineraryDialog } from '@/components/itineraries/quick-create-itinerary-dialog'
import { authClient } from '@/lib/auth-client'

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
  const { theme, setTheme } = useTheme()

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="More navigation">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to="/community" className="cursor-pointer">
            <Building2 />
            Community
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={toggleTheme}>
          {theme === 'dark' ? <Moon /> : <Sun />}
          Toggle theme
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
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to="/community">Community</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <ThemeToggle />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <Suspense fallback={null}>
            <QuickCreateNavButton />
          </Suspense>
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
