import { BrowserRouter, Route, Routes } from "react-router";
import { lazy, Suspense } from "react";

import MainLayout from "./layouts/MainLayout";
import TransitionLayout from "./layouts/TransitionLayout";
import AdminLayout from "./layouts/AdminLayout";

import ScrollToTop from "./components/ScrollToTop";
import Private from "./routes/Private";
import Admin from "./routes/Admin";
import SuspenseFallback from "./components/SuspenseFallback";
import OrderConfirmation from "./pages/OrderConfirmation";

const Home = lazy(() => import("./pages/Home"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Shop = lazy(() => import("./pages/Shop"));
const Account = lazy(() => import("./pages/Account"));
const Product = lazy(() => import("./pages/Product"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderSummary = lazy(() => import("./pages/OrderSummary"));
const Profile = lazy(() => import("./pages/Profile"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const ChangePhoneNumber = lazy(() => import("./pages/ChangePhoneNumber"));
const InputOTPComponent = lazy(() => import("./pages/InputOTP"));
const VerifyPhoneNumber = lazy(() => import("./pages/VerifyPhoneNumber"));
const CheckEmailNotification = lazy(() =>
  import("./components/CheckEmailNotification")
);
const NotFound = lazy(() => import("./pages/NotFound"));

const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Users = lazy(() => import("./pages/admin/Users"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const OrderDetails = lazy(() => import("./components/OrderDetails"));

const PATHS = {
  HOME: "/",
  CONTACT: "/contact",
  ABOUT: "/about",
  SHOP: "/shop",
  ACCOUNT: "/account/:type?",
  CHECK_EMAIL: "/check-email",
  PRODUCT: "/product/:id",
  VERIFY_EMAIL: "/verify-email/:token",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  CHANGE_PHONE: "/change-phone",
  VERIFY_PHONE: "/verify-phone",
  VERIFY_OTP: "/verify-otp",
  PROFILE: "/profile",
  CHECKOUT: "/checkout",
  ORDER_CONFIRMATION: "/order-confirmation/:orderId",
  ORDER_SUMMARY: "/ordersummary/:id",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    USERS: "/admin/users",
    PRODUCTS: "/admin/products",
    PRODUCT_DETAILS: "/admin/products/:id",
    CATEGORIES: "/admin/categories",
    ORDERS: "/admin/orders",
    ORDER_DETAILS: "/admin/orders/:id",
  },
};

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route element={<TransitionLayout />}>
              <Route path={PATHS.HOME} index element={<Home />} />
              <Route path={PATHS.CONTACT} element={<ContactUs />} />
              <Route path={PATHS.ABOUT} element={<AboutUs />} />
              <Route path={PATHS.SHOP} element={<Shop />} />
              <Route path={PATHS.ACCOUNT} element={<Account />} />
              <Route
                path={PATHS.CHECK_EMAIL}
                element={<CheckEmailNotification />}
              />
              <Route path={PATHS.PRODUCT} element={<Product />} />
              <Route
                path={PATHS.VERIFY_EMAIL}
                element={<EmailVerification />}
              />
              <Route
                path={PATHS.FORGOT_PASSWORD}
                element={<ForgotPassword />}
              />
              <Route path={PATHS.RESET_PASSWORD} element={<ResetPassword />} />
              <Route
                path={PATHS.CHANGE_PHONE}
                element={<ChangePhoneNumber />}
              />
              <Route
                path={PATHS.VERIFY_PHONE}
                element={<VerifyPhoneNumber />}
              />
              <Route path={PATHS.VERIFY_OTP} element={<InputOTPComponent />} />

              {/* Private Routes */}
              <Route element={<Private />}>
                <Route path={PATHS.PROFILE} element={<Profile />} />
                <Route path={PATHS.CHECKOUT} element={<Checkout />} />
                <Route
                  path={PATHS.ORDER_CONFIRMATION}
                  element={<OrderConfirmation />}
                />
                <Route path={PATHS.ORDER_SUMMARY} element={<OrderSummary />} />
              </Route>
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route element={<Admin />}>
              <Route element={<TransitionLayout />}>
                <Route path={PATHS.ADMIN.DASHBOARD} element={<Dashboard />} />
                <Route path={PATHS.ADMIN.USERS} element={<Users />} />
                <Route
                  path={PATHS.ADMIN.PRODUCTS}
                  element={<AdminProducts />}
                />
                <Route path={PATHS.ADMIN.CATEGORIES} element={<Categories />} />
                <Route
                  path={PATHS.ADMIN.PRODUCT_DETAILS}
                  element={<Product />}
                />
                <Route path={PATHS.ADMIN.ORDERS} element={<Orders />} />
                <Route
                  path={PATHS.ADMIN.ORDER_DETAILS}
                  element={<OrderDetails />}
                />
              </Route>
            </Route>
          </Route>

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
