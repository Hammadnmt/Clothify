import { OTP_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const otpApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendOTP: builder.mutation({
      query: (data) => ({
        url: `${OTP_URL}/send-otp`,
        method: "POST",
        body: data,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: `${OTP_URL}/verify-otp`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSendOTPMutation, useVerifyOTPMutation } = otpApi;
