import { useLazySendEmailQuery } from "@/services/usersApi";
import Logger from "@/utils/logger";
import { useEffect } from "react";
import { Link, useLocation } from "react-router";

export default function CheckEmailNotification() {
  const location = useLocation();
  const [triggerSendEmail, { isLoading, isSuccess }] = useLazySendEmailQuery();
  const { fromProfile } = location.state || {};
  useEffect(() => {
    async function sendEmail() {
      try {
        await triggerSendEmail().unwrap();
        Logger.success("Email Delivered Successfully");
      } catch (error) {
        Logger.error(error.messsage, "Email verification failed");
      }
    }
    if (fromProfile) {
      sendEmail();
    }
  }, [fromProfile]);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4 text-center">
          Check Your Email! 📧
        </h2>
        <p className="text-gray-600 mb-4 text-center">
          We've sent a verification link to your email address. Please check
          your inbox (and spam folder) to verify your email.
        </p>
        <p className="text-gray-500 text-sm mb-6 text-center">
          Didn't receive an email? You can request another verification link
          below.
        </p>
        <div className="space-y-4">
          <Link
            to="/resend-verification"
            className="block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Resend Verification Email
          </Link>
          <Link
            to="/"
            className="block w-full text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
