import { BRAND_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const brandApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: (filters) => ({
        url: BRAND_URL + "/",
        params: filters || {},
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Brand"],
    }),
    getBrand: builder.query({
      query: (id) => ({
        url: `${BRAND_URL}/${id}`,
      }),
    }),
    createBrand: builder.mutation({
      query: (data) => ({
        url: `${BRAND_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),
    updateBrand: builder.mutation({
      query: ({ data, id }) => ({
        url: `${BRAND_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `${BRAND_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBrandsQuery,
  useGetBrandQuery,
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useUpdateBrandMutation,
} = brandApi;
