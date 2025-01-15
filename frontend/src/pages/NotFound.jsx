import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-lg p-8 text-center space-y-8">
        <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
        <p className="mt-4 text-2xl text-gray-700">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p className="mt-2 text-lg text-gray-500">
          It might have been moved or deleted, or you may have typed the wrong
          URL.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
