"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarIcon, DollarSignIcon, WrenchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Revenue() {
  const [data, setData] = useState<{ totalRevenue: number; bookingCount: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch('/api/revenue');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Failed to load data.</div>;
  }

  return (
    <>
        <Card>
          <CardHeader>
            <CardTitle>Cars Rented</CardTitle>
            <CarIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{data.bookingCount}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Currently rented out</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <DollarSignIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
            {data.totalRevenue !== null ? (
        <div className="text-4xl font-bold">${data.totalRevenue.toFixed(2)}</div>
      ) : (
        <p>Failed to load revenue data.</p>
      )}
              <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>
            </CardContent>
          </Card>
          </>
  );
}
