"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Tiptap from '@/components/Tiptap';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const CreateDealForm: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/deals/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price, description }),
    });

    if (response.ok) {
      const data = await response.json();
      router.push(`/Deals/${data.id}`);
      toast.success("Created New Deal");
    } else {
      toast.error("Failed to create deal");
    }
  };

  return (
    <Card className='m-5'>
      <form onSubmit={handleSubmit} className="space-y-4">
        <CardHeader>
          <CardTitle>Name</CardTitle>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </CardHeader>

        <CardContent>
          <CardTitle>Price</CardTitle>
          <Input
            type="text"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <CardTitle>Description</CardTitle>
          <Tiptap
            content={description}
            onUpdate={(newContent) => setDescription(newContent)}
          />
        </CardContent>

        <CardFooter>
          <Button type="submit">Create Deal</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateDealForm;
