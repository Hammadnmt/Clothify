import { FAVORITE_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const favoriteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: (filters) => ({
        url: FAVORITE_URL + "/",
        params: filters || {},
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Favorite"],
    }),
    getMineFavorites: builder.query({
      query: (filters) => ({
        url: FAVORITE_URL + "/mine",
        params: filters || {},
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Favorite"],
    }),
    getFavorite: builder.query({
      query: (id) => ({
        url: `${FAVORITE_URL}/${id}`,
      }),
    }),
    createFavorite: builder.mutation({
      query: (data) => ({
        url: `${FAVORITE_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Favorite"],
    }),
    updateFavorite: builder.mutation({
      query: ({ data, id }) => ({
        url: `${FAVORITE_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Favorite"],
    }),
    deleteFavorite: builder.mutation({
      query: (id) => ({
        url: `${FAVORITE_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorite"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetFavoritesQuery,
  useGetFavoriteQuery,
  useGetMineFavoritesQuery,
  useCreateFavoriteMutation,
  useDeleteFavoriteMutation,
  useUpdateFavoriteMutation,
} = favoriteApi;
