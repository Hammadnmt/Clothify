import { Link } from "react-router";

export default function EmailVerificationSuccess() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        Email Verified Successfully! 🤩
      </h2>
      <p className="text-gray-600 mb-4">
        Your email has been verified. You can now make orders.
      </p>
      <Link
        to="/"
        className="block w-full text-center bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Continue to Shopping
      </Link>
    </div>
  );
}
