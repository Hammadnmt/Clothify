import { DASHBOARD_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query({
      query: (filters) => ({
        url: DASHBOARD_URL + "/",
        params: filters || {},
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Dashboard"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardDataQuery } = dashboardApi;
