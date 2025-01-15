import CategoryAccordion from "./CategoryAccordion";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { NavLink } from "react-router";

export default function Navbar() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="hidden md:flex space-x-6">
        <NavigationMenuItem>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive && "border-b-2 border-slate-300"
            }
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </NavLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white shadow-lg p-4 w-full max-w-3xl">
            <CategoryAccordion
              className={
                "grid gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] scroll-smooth overflow-y-auto"
              }
            />
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive && "border-b-2 border-slate-300"
            }
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Contact us
            </NavigationMenuLink>
          </NavLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive && "border-b-2 border-slate-300"
            }
          >
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About us
            </NavigationMenuLink>
          </NavLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
