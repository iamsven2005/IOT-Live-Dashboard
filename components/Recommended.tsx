"use client"
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardTitle } from './ui/card';

// Define the type for car deals
interface CarDeal {
  id: number;
  name: string;
  price: string;
}

const carDeals: CarDeal[] = [
  { id: 1, name: 'Rent 2 fords (F150) 20% off', price: 'Ford $80/day' },
  { id: 2, name: 'Rent a Mustang for a week', price: 'Mustang $120/day' },
  { id: 3, name: 'Refer your friend today!', price: 'Ford $40/day' },
  { id: 4, name: 'Happy Customer!', price: 'First rental 20% off' },
  { id: 5, name: 'Toyota For YOU', price: 'Get 10% off Toyotal this week!' },
  { id: 6, name: 'Party Time!', price: 'Rent 2 get 1 free!' },
  { id: 7, name: 'A day to remember', price: 'Tag us on social media and get $10 off next rental' },
  { id: 8, name: 'Luxury Deals', price: '20% of next rental if you rent a Rolls Royce Today' },
  { id: 9, name: 'What a steal!', price: 'Get $100 off your next refill (Shell or Exon mobil)' },
  { id: 10, name: 'Feel the difference', price: 'Get $200 NTUC vouchers when you rent a Tesla for a week' },
];

const getRandomDeals = (deals: CarDeal[], count: number): CarDeal[] => {
  const shuffled = [...deals].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const CarRentalDeals = () => {
  const [deals, setDeals] = useState<CarDeal[]>([]);

  useEffect(() => {
    const randomDeals = getRandomDeals(carDeals, 4);
    setDeals(randomDeals);
  }, []);

  return (
    <Card>
      <CardTitle>Car Rental Deals</CardTitle>
      <CardContent className='gap-5 m-2 p-2'>
        {deals.map((deal) => (
          <Card key={deal.id}>
            <CardTitle>{deal.name}</CardTitle>
            <CardDescription>{deal.price}</CardDescription> 
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default CarRentalDeals;
