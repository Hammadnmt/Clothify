import { REVIEW_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (filters) => ({
        url: REVIEW_URL + "/",
        params: filters || {},
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Review"],
    }),
    getMineReviews: builder.query({
      query: (filters) => ({
        url: REVIEW_URL + "/mine",
        params: filters || {},
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Review"],
    }),
    getReview: builder.query({
      query: (id) => ({
        url: `${REVIEW_URL}/${id}`,
      }),
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${REVIEW_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),
    updateReview: builder.mutation({
      query: ({ data, id }) => ({
        url: `${REVIEW_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `${REVIEW_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useUpdateReviewMutation,
} = reviewsApi;
