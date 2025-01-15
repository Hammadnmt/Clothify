import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, NavLink, useNavigate } from "react-router";
import Logo from "../Logo";
import {
  ChartBarStacked,
  ChartNoAxesCombined,
  ChevronDown,
  CircleGauge,
  LogOut,
  Package,
  Settings,
  ShoppingBasket,
  SquareKanban,
  User,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { useDispatch } from "react-redux";
import { resetCart } from "@/services/cartSlice";
import { logout } from "@/services/authSlice";
import { useSignoutMutation } from "@/services/usersApi";
import { useEffect } from "react";
import Logger from "@/utils/logger";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export function AppSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, clearError, handleError } = useErrorHandler();
  const [signout, { isLoading, isError, isSuccess, error: signoutError }] =
    useSignoutMutation();

  useEffect(() => {
    if (isError && signoutError) {
      handleError(signoutError.data?.message, signoutError);
    }

    if (isSuccess) {
      Logger.success("Signed out Successfully 👋");
      clearError();
      dispatch(resetCart());
      dispatch(logout());
      navigate("/account");
    }
  }, [isError, signoutError, isSuccess]);

  const handleSignout = async () => {
    try {
      if (isLoading) return;
      await signout().unwrap();
    } catch (err) {
      handleError(err.data?.message, err);

      // console.log(err);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center gap-2 px-4 py-3 font-bold text-lg border-b border-gray-300">
        <Link to={"/"}>
          <Logo className={"rounded-full w-16 h-16"} />
        </Link>
        <div className="">
          <h4 className="text-lg font-bold text-pink-600">
            <Link to="/">Clothify</Link>
          </h4>
          <p className="text-xs text-slate-400">e-commerce store</p>
        </div>
        <button
          onClick={handleSignout}
          className="hover:bg-pink-300 hover:rounded-full p-2 hover:text-white"
        >
          <LogOut size={16} />
        </button>
      </SidebarHeader>
      <SidebarContent className="flex-1 px-2">
        <SidebarGroup>
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex justify-start items-center gap-2 py-2 px-3 rounded-lg ${
                isActive
                  ? "bg-pink-100 border-solid border border-pink-300"
                  : "hover:bg-pink-100 "
              }`
            }
          >
            <CircleGauge size={18} className="stroke-pink-400" />
            Dashboard
          </NavLink>
          {/* <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `flex justify-start items-center gap-2 py-2 px-3 rounded-lg ${
                          isActive
                            ? "bg-pink-100 border-solid border border-pink-300"
                            : "hover:bg-pink-100 "
                        }`
            }
          >
            <ChartNoAxesCombined size={20} />
            Analytics
          </NavLink>
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `flex justify-start items-center gap-2 py-2 px-3 rounded-lg ${
                          isActive
                            ? "bg-pink-100 border-solid border border-pink-300"
                            : "hover:bg-pink-100 "
                        }`
            }
          >
            <Settings />
            Settings
          </NavLink> */}

          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="flex justify-start items-center gap-2 py-2 px-3 rounded-lg">
                  <SquareKanban size={18} className="stroke-pink-400" />

                  <span className="text-base">Inventory</span>
                  <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/admin/orders"
                      className={({ isActive }) =>
                        `flex justify-start items-center gap-2 py-2 px-3 rounded-lg ${
                          isActive
                            ? "bg-pink-100 border-solid border border-pink-300"
                            : "hover:bg-pink-100 "
                        }`
                      }
                    >
                      <Package size={18} className="stroke-pink-400" />
                      Orders
                    </NavLink>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/admin/products"
                      className={({ isActive }) =>
                        `flex justify-start items-center gap-2 py-2 px-3 rounded-lg ${
                          isActive
                            ? "bg-pink-100 border-solid border border-pink-300"
                            : "hover:bg-pink-100 "
                        }`
                      }
                    >
                      <ShoppingBasket size={18} className="stroke-pink-400" />
                      Products
                    </NavLink>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/admin/users"
                      className={({ isActive }) =>
                        `flex justify-start items-center gap-2 py-2 px-3 rounded-lg ${
                          isActive
                            ? "bg-pink-100 border-solid border border-pink-300"
                            : "hover:bg-pink-100 "
                        }`
                      }
                    >
                      <User size={18} className="stroke-pink-400" />
                      Users
                    </NavLink>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <NavLink
                      to="/admin/categories"
                      className={({ isActive }) =>
                        `flex justify-start items-center gap-2 py-2 px-3 rounded-lg ${
                          isActive
                            ? "bg-pink-100 border-solid border border-pink-300"
                            : "hover:bg-pink-100 "
                        }`
                      }
                    >
                      <ChartBarStacked size={18} className="stroke-pink-400" />
                      Categories
                    </NavLink>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-slate-400">
          © {new Date().getFullYear()} Clothify - Admin Panel
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
