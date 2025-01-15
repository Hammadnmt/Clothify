import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, Verified } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Paginate from "./Paginate";
import LoadingSpinner from "./ui/loadingSpinner";
import { useGetReviewsQuery } from "@/services/reviewsApi";
import { useSearchParams } from "react-router";

export default function Reviews({ id }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = Object.fromEntries(searchParams.entries());
  const {
    data: reviews,
    isLoading,
    isError,
  } = useGetReviewsQuery({
    ...filters,
    product: id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-gray-500 min-h-[400px] flex items-center justify-center">
        Failed to load reviews. Please try again later.
      </div>
    );
  }

  const StarRating = ({ rating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  const handlePageChange = (page) => {
    setSearchParams({ page });
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 my-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          Customer Reviews ({reviews.pagination.totalItems})
        </h2>
        <div className="text-sm text-gray-500">
          Showing {reviews.data?.length} of {reviews.pagination.totalItems}{" "}
          reviews
        </div>
      </div>

      <div className="space-y-4">
        {reviews.data.map((review) => (
          <Card key={review._id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{review.user.name}</span>
                    {review.isVerifiedPurchase && (
                      <Verified className="h-4 w-4 fill-blue-500 stroke-white" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {review.product.name}
                  </div>
                </div>

                <div className="flex-[2]">
                  {review.comment ? (
                    <p className="text-gray-700">{review.comment}</p>
                  ) : (
                    <p className="text-gray-500 italic">
                      No written review provided
                    </p>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Helpful ({review.helpfulCount})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Paginate
          currentPage={reviews?.pagination?.currentPage}
          totalPages={reviews?.pagination?.totalPages}
          onPageChange={(page) => handlePageChange(page)}
        />
      </div>
    </div>
  );
}
