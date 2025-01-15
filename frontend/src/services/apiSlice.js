import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL, USERS_URL } from "@/constants";
import { logout } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
});

async function baseQueryWithAuth(args, api, extra) {
  const result = await baseQuery(args, api, extra);

  if (result.error && result.error.status === 401) {
    const response = await fetch(`${BASE_URL}${USERS_URL}/signout`, {
      method: "POST",
      credentials: "include",
    });
    if (response.ok) {
      api.dispatch(logout());
    }
  }
  return result;
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Product",
    "Order",
    "User",
    "Dashboard",
    "Category",
    "Review",
    "Favorite",
  ],
  endpoints: (builder) => ({}),
});
