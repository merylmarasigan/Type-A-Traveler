import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { AuthHeader } from '@/components/auth/header-user'
import { Link } from '@tanstack/react-router'
import { Image } from '@unpic/react'

export function Header() {
  return (
    <header className="p-4 bg-blue-500 w-full">
      <div className="flex justify-between items-center w-full">
        <Link to="/">
          <Image
            src="banner logo idea.png"
            layout="constrained"
            width={192}
            height={48}
            alt="Type A Traveler"
            className="invert hover:invert-90"
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
                  <Link
                    to="/community"
                    className={navigationMenuTriggerStyle()}
                  >
                    Community
                  </Link>
                </NavigationMenuLink>
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

// export default function Header() {
//   return (
//     <header className="p-2">
//       <NavigationMenu>
//         <NavigationMenuList>
//           <NavigationMenuItem>
//             <NavigationMenuLink
//               asChild
//               className={navigationMenuTriggerStyle()}
//             >
//               <Link to="/">Type A Traveler</Link>
//             </NavigationMenuLink>
//           </NavigationMenuItem>
//           <NavigationMenuItem>
//             <AuthHeader />
//           </NavigationMenuItem>
//         </NavigationMenuList>
//       </NavigationMenu>
//     </header>
//   )
// }
