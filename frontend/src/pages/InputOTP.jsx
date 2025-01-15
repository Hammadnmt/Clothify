import { useState, useEffect } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Timer } from "lucide-react";
import { useSendOTPMutation, useVerifyOTPMutation } from "@/services/otpApi";
import { useLocation, useNavigate } from "react-router";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import Logger from "@/utils/logger";
import { parsePhoneNumber } from "react-phone-number-input";

export default function InputOTPComponent() {
  const location = useLocation();
  const { phone } = location.state || {};

  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [verifyOTP, { isLoading, isSuccess }] = useVerifyOTPMutation();
  const [sendOTP, { isLoading: otpLoading, isSuccess: otpSuccess }] =
    useSendOTPMutation();
  const { error, clearError, handleError } = useErrorHandler();

  useEffect(() => {
    if (otpSuccess) {
      Logger.success("OTP sended successfully, Kindly Check your WhatsApp!");
      clearError();
    }

    if (isSuccess) {
      Logger.success("Phone Number verified successfully! 😊");
      clearError();
      setOtp("");
      navigate("/", { replace: true });
    }

    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend, otpSuccess, isSuccess]);

  const handleComplete = async (value) => {
    if (isLoading || otpLoading) return;

    try {
      // console.log(value, phone);

      let whatsappFormattedPhone;

      if (parsePhoneNumber(phone) === undefined) {
        whatsappFormattedPhone = phone;
      } else {
        const parsedNumber = parsePhoneNumber(phone);

        if (!parsedNumber) {
          throw new Error("Invalid phone number format");
        }
        whatsappFormattedPhone = parsedNumber.number.replace("+", "");
      }

      await verifyOTP({ phone: whatsappFormattedPhone, otp: value });
    } catch (error) {
      handleError(error?.data?.message || "An error occurred", error);
    }
  };

  const handleResendOTP = async () => {
    if (isLoading || otpLoading) return;
    setCanResend(false);
    setTimer(300);
    setOtp("");
    try {
      await sendOTP({ phone });
    } catch (error) {
      handleError(error?.data?.message || "An error occurred", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-[500px] space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Verify Your Phone Number</h2>
          <p className="text-gray-500 text-sm">
            We've sent a verification code to your WhatsApp
          </p>
        </div>

        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          onComplete={handleComplete}
          disabled={isLoading || otpLoading}
        >
          <InputOTPGroup className="flex gap-2 justify-center">
            {[0, 1, 2].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-14 h-14 border-2 border-gray-200 rounded-md text-center text-xl focus:border-blue-500 transition-all"
              />
            ))}
          </InputOTPGroup>

          <InputOTPSeparator className="mx-2">
            <div className="w-2 h-2 rounded-full bg-gray-200" />
          </InputOTPSeparator>

          <InputOTPGroup className="flex gap-2 justify-center">
            {[3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="w-14 h-14 border-2 border-gray-200 rounded-md text-center text-xl focus:border-blue-500 transition-all"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <div className="flex flex-col items-center gap-4">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            {!canResend ? (
              <>
                <Timer className="h-4 w-4" />
                <span>Resend available in {timer}s</span>
              </>
            ) : (
              <span>Didn't receive the code?</span>
            )}
          </div>

          <Button
            variant="outline"
            onClick={handleResendOTP}
            disabled={!canResend || isLoading || otpLoading}
            className="w-full"
          >
            Resend OTP
          </Button>
        </div>
      </div>
    </div>
  );
}
