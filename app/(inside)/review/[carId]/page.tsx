"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import StarRating from "./rating";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  params: {
    carId: string;
  };
}

interface Review {
  id: string;
  review: string;
  vote: number;
}

const ReviewPage = ({ params }: Props) => {
  const [rating, setRating] = useState(0);
  const [reviewData, setReviewData] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingSearchTerm, setRatingSearchTerm] = useState("");
  const [textSearchTerm, setTextSearchTerm] = useState("");

  // Fetch all reviews when the component mounts
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${params.carId}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [params.carId, successMessage]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    try {
      const carId = params.carId;
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewdata: reviewData, vote: rating, carId }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await response.json();
      console.log(data);

      setReviewData("");
      setRating(0);
      setSuccessMessage("Review submitted successfully!");
      setError("");
    } catch (error) {
      console.error(error);
      setError("An error occurred while submitting the review.");
    }
  };

  // Filter reviews by rating search term and text search term
  const filteredReviews = reviews.filter((review) => {
    const matchesRating = ratingSearchTerm
      ? review.vote === parseInt(ratingSearchTerm)
      : true;
    const matchesText = textSearchTerm
      ? review.review.toLowerCase().includes(textSearchTerm.toLowerCase())
      : true;
    return matchesRating && matchesText;
  });

  return (
    <div className="max-w-lg mx-auto my-10">
      <Card>
        <CardHeader>
          <CardTitle>Submit Your Review</CardTitle>
          <Button asChild>
          <Link href={"/bookings"}>View Bookings</Link>
          </Button>
          
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                Your Review
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={reviewData}
                onChange={(e) => setReviewData(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">
                Your Rating
              </label>
              <StarRating rating={rating} setRating={setRating} />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            {successMessage && (
              <div className="text-green-500">{successMessage}</div>
            )}
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Review
            </button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-5">
          {/* Search bar for filtering by star rating */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Search by Rating
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter star rating to filter"
              value={ratingSearchTerm}
              onChange={(e) => setRatingSearchTerm(e.target.value)}
              min="1"
              max="5"
            />
          </div>

          {/* Search bar for filtering by text review */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Search by Review Text
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter keyword to search reviews"
              value={textSearchTerm}
              onChange={(e) => setTextSearchTerm(e.target.value)}
            />
          </div>

          {/* Display filtered reviews */}
          {filteredReviews.length === 0 ? (
            <p>No reviews found for your criteria.</p>
          ) : (
            filteredReviews.map((rev: Review) => (
              <Card key={rev.id} className="mb-4">
                <CardContent>
                  <p className="font-semibold">Rating: {rev.vote} Stars</p>
                  <p>{rev.review}</p>
                </CardContent>
              </Card>
            ))
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReviewPage;
