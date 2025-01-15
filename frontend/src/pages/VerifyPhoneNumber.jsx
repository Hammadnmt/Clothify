import "react-phone-number-input/style.css";

import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useEffect } from "react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import Logger from "@/utils/logger";
import PhoneInputWithCountrySelect, {
  parsePhoneNumber,
} from "react-phone-number-input";
import { useSendOTPMutation } from "@/services/otpApi";

export default function VerifyPhoneNumber() {
  const navigate = useNavigate();
  const location = useLocation();
  const { phone } = location.state || {};
  const [sendOTP, { isLoading: otpLoading, isSuccess: otpSuccess }] =
    useSendOTPMutation();
  const { error, clearError, handleError } = useErrorHandler();

  useEffect(() => {
    if (otpSuccess) {
      Logger.success("OTP sended successfully, Kindly Check your WhatsApp!");
      clearError();
      navigate("/verify-otp", {
        replace: true,
        state: { phone },
      });
    }
  }, [otpSuccess]);

  const submitForm = async (e) => {
    e.preventDefault();
    if (otpLoading) return;

    try {
      const parsedNumber = parsePhoneNumber(phone);
      if (!parsedNumber) {
        throw new Error("Invalid phone number format");
      }

      const whatsappFormattedPhone = parsedNumber.number.replace("+", "");

      await sendOTP({ phone: whatsappFormattedPhone }).unwrap();
    } catch (error) {
      handleError(error?.data?.message || "An error occurred", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Verify Your Phone Number?
        </h2>
        <p className="text-gray-600 text-center mb-4">
          Click on send and we’ll send you an OTP on WhatsApp to verify your
          phone number.
        </p>
        <form onSubmit={submitForm}>
          <div className="mb-4">
            <PhoneInputWithCountrySelect
              international
              countryCallingCodeEditable={false}
              defaultCountry="PK"
              disabled={true}
              placeholder="phone"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              required
              value={phone || null}
              onChange={() => {}}
            />
          </div>
          <Button
            disabled={otpLoading}
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-300"
          >
            {otpLoading ? <LoadingSpinner /> : "Send"}
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
