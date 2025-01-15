import { Link } from "react-router";

export default function EmailVerificationFailed() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-red-600 mb-4">
        Email Verification Failed! 😔
      </h2>
      <p className="text-gray-600 mb-4">
        The verification link is invalid or has expired. Please request a new
        verification email.
      </p>
      <Link
        to="/resend-verification"
        className="block w-full text-center bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 mb-4"
      >
        Resend Verification Email
      </Link>
      <Link
        to="/"
        className="block w-full text-center bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
      >
        Back to Home
      </Link>
    </div>
  );
}
