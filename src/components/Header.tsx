import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { AuthHeader } from '@/integrations/better-auth/header-user'
import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-2 bg-blue-500 w-full">
      <div className="flex justify-between items-center w-full h-20">
        {/* <Link to="/" className="text-white font-bold">Type A Traveler</Link> */}
        <Link to="/">
          <img src="banner logo idea.png" alt="Type A Traveler" className="h-12 invert" />
        </Link>
        <div className="flex items-center gap-4">
           <Link to="/community" className="text-white">
            Community
          </Link>
          <AuthHeader />

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
