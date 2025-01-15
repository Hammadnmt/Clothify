import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6 py-12 sm:px-12">
      <Card className="max-w-lg w-full bg-white shadow-lg rounded-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-semibold text-gray-800">
            😟 Something Went Wrong
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-6">
            We encountered an issue while processing your request. Please try
            again!
          </CardDescription>
        </CardHeader>
        <div className="flex justify-center items-center py-6">
          <Button size="lg" onClick={resetErrorBoundary} className="">
            Try Again
          </Button>
          <a href="/" className="ml-4 underline text-blue-600">
            Go To Home
          </a>
        </div>
      </Card>
    </div>
  );
}
