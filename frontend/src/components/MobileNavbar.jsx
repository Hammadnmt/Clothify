import { NavLink } from "react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import CategoryAccordion from "./CategoryAccordion";

export default function MobileNavbar() {
  return (
    <nav className="flex flex-col space-y-4 p-4">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "hover:text-gray-700 border-b-2 border-slate-300"
            : "hover:text-gray-700"
        }
      >
        Home
      </NavLink>
      <Collapsible>
        <CollapsibleTrigger>
          <div className="flex items-center justify-between">
            <span>Categories</span>
            <ChevronsUpDown className="ml-6 h-4 w-4" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CategoryAccordion />
        </CollapsibleContent>
      </Collapsible>
      <NavLink
        to="/contact"
        className={({ isActive }) =>
          isActive
            ? "hover:text-gray-700 border-b-2 border-slate-300"
            : "hover:text-gray-700"
        }
      >
        Contact us
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          isActive
            ? "hover:text-gray-700 border-b-2 border-slate-300"
            : "hover:text-gray-700"
        }
      >
        About us
      </NavLink>
    </nav>
  );
}
