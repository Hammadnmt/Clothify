import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useGetUserRoleQuery } from "@/services/usersApi";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";

export default function Admin() {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: user, isLoading, isError } = useGetUserRoleQuery();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !user) {
    return <Navigate to="/account" replace />;
  }

  if (!userInfo || !["admin", "owner"].includes(user.role)) {
    return <Navigate to="/account" replace />;
  }

  return <>{!isLoading && <Outlet />}</>;
}
