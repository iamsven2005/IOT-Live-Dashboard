"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CarIcon } from "lucide-react";

const TotalCars = () => {
  const [count, setCount] = useState<number | string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarCount = async () => {
      try {
        const response = await fetch('/api/totalCars');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCount(data.count);
      } catch (error) {
        console.error('Failed to fetch car count:', error);
        setCount('Error');
      } finally {
        setLoading(false);
      }
    };

    fetchCarCount();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Cars</CardTitle>
        <CarIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold">{count}</div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Available for rent</p>
      </CardContent>
    </Card>
  );
};

export default TotalCars;
