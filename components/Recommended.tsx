"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';

interface CarDeal {
  id: number;
  name: string;
  price: string;
}

const getRandomDeals = (deals: CarDeal[], count: number): CarDeal[] => {
  const shuffled = [...deals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const CarRentalDeals = () => {
  const [deals, setDeals] = useState<CarDeal[]>([]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/deals');
        const carDeals: CarDeal[] = await response.json();
        const randomDeals = getRandomDeals(carDeals, 4);
        setDeals(randomDeals);
      } catch (error) {
        console.error("Failed to fetch car deals:", error);
      }
    };

    fetchDeals();
  }, []);

  return (
    <Card>
      <CardContent className='gap-2 m-2 p-2 flex flex-col'>
      <CardTitle>Car Rental Deals</CardTitle>

        {deals.map((deal) => (
          <Card key={deal.id} className='p-2'>
            <Link href={`/Deals/${deal.id}`}>
            <CardTitle>{deal.name}</CardTitle>
            <CardDescription>{deal.price}</CardDescription>
            </Link>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default CarRentalDeals;
