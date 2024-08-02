"use client"
import { Star } from "lucide-react";
import { useState } from "react";

const StarRating = ({ rating, setRating }: any) => {
  const handleClick = (index: number) => {
    setRating(index + 1);
  };

  return (
    <div className="flex space-x-1">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          onClick={() => handleClick(index)}
          className={`cursor-pointer ${
            rating > index ? "text-yellow-500" : "text-gray-400"
          }`}
        />
      ))}
    </div>
  );
};

export default StarRating;
