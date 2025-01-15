import { UPLOAD_URL } from "@/constants";
import { apiSlice } from "./apiSlice";

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadUserProfileImage: builder.mutation({
      query: (image) => ({
        url: UPLOAD_URL + "/profile/image",
        method: "POST",
        body: image,
      }),
    }),
    removeUserProfileImage: builder.mutation({
      query: () => ({
        url: UPLOAD_URL + "/profile/image",
        method: "DELETE",
      }),
    }),
    uploadProductImages: builder.mutation({
      query: (data) => ({
        url: UPLOAD_URL + `/product/image/${data._id}/${data.variant}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useUploadUserProfileImageMutation,
  useRemoveUserProfileImageMutation,
  useUploadProductImagesMutation,
} = uploadApi;
