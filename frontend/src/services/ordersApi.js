import { ORDERS_URL, PAYMENT_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (filters) => ({
        url: ORDERS_URL + "/",
        params: filters || {},
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Order"],
    }),
    getOrder: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
    }),
    getMineOrder: builder.query({
      query: (filters) => ({
        url: `${ORDERS_URL}/mine`,
        params: filters || {},
      }),
    }),
    updateOrder: builder.mutation({
      query: ({ data, id }) => ({
        url: `${ORDERS_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Order"],
    }),
    createPaymentIntent: builder.mutation({
      query: (orderId) => ({
        url: `${PAYMENT_URL}/create-payment-intent`,
        method: "POST",
        body: { orderId },
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useGetMineOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useCreatePaymentIntentMutation,
} = ordersApi;
