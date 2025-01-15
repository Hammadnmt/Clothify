import { RECAPTCHA_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const recaptchaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    verifyCaptcha: builder.mutation({
      query: (data) => ({
        url: `${RECAPTCHA_URL}/verify-captcha`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useVerifyCaptchaMutation } = recaptchaApi;
