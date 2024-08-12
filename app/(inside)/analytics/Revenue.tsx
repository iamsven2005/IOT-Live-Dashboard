import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { CarIcon, DollarSignIcon, WrenchIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function Revenue() {
  const bookings = await db.booking.findMany({
    select: {
      amount: true,
    },
  });
  
  if (!bookings || bookings.length === 0) {
    notFound()
  }
  
  const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
  const bookingCount = bookings.length;
  return (
    <>
        <Card>
          <CardHeader>
            <CardTitle>Cars Rented</CardTitle>
            <CarIcon className="size-8 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{bookingCount}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Currently rented out</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <DollarSignIcon className="size-8 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
            {totalRevenue !== null ? (
        <div className="text-4xl font-bold">${totalRevenue.toFixed(2)}</div>
      ) : (
        <p>Failed to load revenue data.</p>
      )}
              <p className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</p>            <Button asChild>
            <Link href="/expenses">View Expenses</Link>
            </Button>
            </CardContent>

            
          </Card>
          </>
  );
}
