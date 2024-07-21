"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Link from 'next/link';

interface Deal {
  id: number;
  name: string;
  price: string;
  description: string;
}

const DealsList: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await fetch('/api/deals');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setDeals(result);
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Create the new deal in the database
    const response = await fetch('/api/deals/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price, description }),
    });

    if (response.ok) {
      const newDeal = await response.json();
      setDeals((prevDeals) => [...prevDeals, newDeal]);
      setName('');
      setPrice('');
      setDescription('');
      toast.success("Created New Deal");
      router.refresh();
    } else {
      toast.error("Failed to create deal");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!deals.length) {
    return <div>No deals found.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deals</CardTitle>
        <CardDescription>
          <Link href="/Deals">
            <Button>
                Create
            </Button>
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
          {deals.map((deal) => (
            <Link href={`/Deals/${deal.id}`} key={deal.id}>
              <Button variant="link">{deal.name}</Button>
            </Link>
          ))}
      </CardContent>
    </Card>
  );
};

export default DealsList;

