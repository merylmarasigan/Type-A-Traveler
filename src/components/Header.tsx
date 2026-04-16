import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { AuthHeader } from '@/components/auth/header-user'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="p-4 w-full">
      <div className="flex justify-between items-center w-full">
        <Link to="/">
          <Image
            src={`type_a_traveler_logo.png`}
            layout="constrained"
            width={192}
            height={48}
            alt="Type A Traveler"
            className="dark:invert hover:invert-90 dark:hover:invert-90"
          />
        </Link>
        <div className="flex items-center gap-4">
          <NavigationMenu>
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
              <NavigationMenuItem>
                <AuthHeader />
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  )
}
