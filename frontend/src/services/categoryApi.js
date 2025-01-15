import { CATEGORY_URL, SUB_CATEGORY_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: CATEGORY_URL + "/",
      }),
      providesTags: ["Category"],
    }),
    getSubCategories: builder.query({
      query: () => ({
        url: SUB_CATEGORY_URL + "/",
      }),
      providesTags: ["Category"],
    }),
    createCategory: builder.mutation({
      query: (data) => ({
        url: `${CATEGORY_URL}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
    createSubCategory: builder.mutation({
      query: (data) => ({
        url: `${SUB_CATEGORY_URL}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useCreateCategoryMutation,
  useCreateSubCategoryMutation,
} = categoryApi;
