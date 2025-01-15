import "react-phone-number-input/style.css";

import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useUpdatePhoneMutation } from "@/services/usersApi";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import FormError from "@/components/FormError";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Logger from "@/utils/logger";
import { useForm } from "react-hook-form";
import PhoneInputWithCountrySelect, {
  parsePhoneNumber,
} from "react-phone-number-input";
import { useSendOTPMutation } from "@/services/otpApi";

export default function ChangePhoneNumber() {
  const navigate = useNavigate();
  const [updatePhone, { isLoading, isSuccess, data: response }] =
    useUpdatePhoneMutation();
  const [sendOTP, { isLoading: otpLoading, isSuccess: otpSuccess }] =
    useSendOTPMutation();
  const { error, clearError, handleError } = useErrorHandler();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isSuccess && otpSuccess) {
      Logger.success("OTP sended successfully, Kindly Check your WhatsApp!");
      clearError();
      reset();
      navigate("/verify-otp", {
        replace: true,
        state: { phone: response?.user?.phone },
      });
    }
  }, [isSuccess, otpSuccess]);

  const submitForm = async (formData) => {
    if (isLoading || otpLoading) return;

    try {
      const { phone } = formData;
      const parsedNumber = parsePhoneNumber(phone);
      if (!parsedNumber) {
        throw new Error("Invalid phone number format");
      }

      const whatsappFormattedPhone = parsedNumber.number.replace("+", "");

      await updatePhone({ phone: whatsappFormattedPhone }).unwrap();
      await sendOTP({ phone: whatsappFormattedPhone }).unwrap();
    } catch (error) {
      handleError(error?.data?.message || "An error occurred", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Change Your Phone Number?
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Enter your phone number below and we’ll send you an OTP on WhatsApp to
          verify your phone number.
        </p>
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="mb-4">
            <PhoneInputWithCountrySelect
              international
              countryCallingCodeEditable={false}
              defaultCountry="PK"
              disabled={isLoading || otpLoading}
              placeholder="phone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
              {...register("phone", { required: "Phone number is required" })}
            />
            {errors?.phone && <FormError message={errors?.phone?.message} />}
          </div>
          <Button
            disabled={isLoading || otpLoading}
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
          >
            {isLoading || otpLoading ? <LoadingSpinner /> : "Send"}
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Changed your mind?
            <Link to="/" className="text-green-600 hover:underline ml-1">
              go back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
