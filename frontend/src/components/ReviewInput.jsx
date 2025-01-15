import React, { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import { useCreateReviewMutation } from "@/services/reviewsApi";
import Logger from "@/utils/logger";

const ReviewInput = ({ id }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const { error, handleError, clearError } = useErrorHandler();
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleCreate = async () => {
    if (rating === 0) {
      Logger.error("Please select a rating");
      return;
    }

    try {
      await createReview({ product: id, rating, comment }).unwrap();
      clearError();
      setRating(0);
      setComment("");
      Logger.success("Review published successfully 😀");
    } catch (error) {
      //   console.log(error);
      if (error.status === 401) {
        handleError("Please Login to add a review");
      } else {
        handleError(error?.data?.message || "Failed to publish review", error);
      }
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Write a Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error.hasError && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error.errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= (hover || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {rating
              ? `You've selected ${rating} star${rating !== 1 ? "s" : ""}`
              : "Click to rate"}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium">
            Your Review
          </label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about the product..."
            className="min-h-[120px]"
            maxLength={500}
          />
          <p className="text-sm text-gray-500">
            {comment.length}/500 characters
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleCreate}
          disabled={isLoading}
          className="w-full sm:w-auto"
        >
          {isLoading ? "Publishing..." : "Publish Review"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewInput;
