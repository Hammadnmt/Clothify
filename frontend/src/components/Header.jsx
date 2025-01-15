import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import {
  Menu,
  ShoppingCart,
  User,
  Search,
  LogOutIcon,
  ShieldAlert,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSignoutMutation } from "@/services/usersApi";
import { logout } from "@/services/authSlice";
import Navbar from "./NavBar";
import CartDrawer from "./CartDrawer";
import { resetCart } from "@/services/cartSlice";
import MobileNavbar from "./MobileNavbar";
import SearchSuggestions from "./SearchSuggestions";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import Logger from "@/utils/logger";

export default function Header() {
  const { userInfo } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { error, handleError, clearError } = useErrorHandler();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signout, { isLoading }] = useSignoutMutation();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSignout = async () => {
    try {
      if (isLoading) return;
      await signout().unwrap();

      dispatch(resetCart());
      dispatch(logout());
      Logger.success("Signed out successfully 👋");
      clearError();
      navigate("/account");
    } catch (err) {
      handleError("Failed to sign out", err);
      // console.log(err);
    }
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <h4 className="text-2xl font-bold text-pink-600">
          <Link to="/">Clothify</Link>
        </h4>

        <Navbar />

        <div className="flex items-center space-x-4">
          <SearchSuggestions />

          <Sheet>
            <SheetTrigger>
              <div className="relative">
                <button title="Cart" className="hover:text-gray-700 pt-1">
                  <ShoppingCart size={20} />
                </button>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </SheetTrigger>
            <CartDrawer />
          </Sheet>
          {userInfo?.token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={isLoading}>
                <button
                  disabled={isLoading}
                  title="Profile"
                  className="hover:text-gray-700"
                >
                  <User size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {["admin", "owner"].includes(userInfo.role) && (
                    <DropdownMenuItem
                      className="text-green-500"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      <ShieldAlert />
                      <span>Admin Portal</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleSignout}
                  >
                    <LogOutIcon />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button title="Profile" className="hover:text-gray-700">
              <Link to={"/account"}>
                <User size={20} />
              </Link>
            </button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden hover:text-gray-700">
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className={"overflow-y-auto"}>
              <MobileNavbar />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
