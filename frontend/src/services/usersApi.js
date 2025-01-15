import { USERS_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signup`,
        method: "POST",
        body: data,
      }),
    }),
    signin: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signin`,
        method: "POST",
        body: data,
      }),
    }),
    signout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/signout`,
        method: "POST",
      }),
    }),
    getUserRole: builder.query({
      query: () => ({
        url: `${USERS_URL}/role`,
      }),
    }),
    verifyEmail: builder.query({
      query: (token) => ({
        url: USERS_URL + `/verify-email/${token}`,
      }),
    }),
    sendEmail: builder.query({
      query: () => ({
        url: USERS_URL + `/send-email`,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: USERS_URL + "/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ data, token }) => ({
        url: USERS_URL + `/reset-password/${token}`,
        method: "POST",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: (filters) => ({
        url: USERS_URL + "/",
        params: filters || {},
      }),
      keepUnusedDataFor: 5,
      providesTags: ["User"],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
    }),
    getMine: builder.query({
      query: () => ({
        url: `${USERS_URL}/mine`,
      }),
      providesTags: ["User"],
    }),
    updateMine: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/mine`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: USERS_URL + "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ data, id }) => ({
        url: `${USERS_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updatePhone: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-phone`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    updateAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-address`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteAddress: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/change-address`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignupMutation,
  useSigninMutation,
  useSignoutMutation,
  useVerifyEmailQuery,
  useLazySendEmailQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdatePhoneMutation,
  useGetUsersQuery,
  useGetMineQuery,
  useGetUserQuery,
  useGetUserRoleQuery,
  useUpdateMineMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} = usersApi;
