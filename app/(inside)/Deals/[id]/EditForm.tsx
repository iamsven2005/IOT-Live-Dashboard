"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Tiptap from '@/components/Tiptap';
import { toast } from 'sonner';

interface EditDealFormProps {
  deal: {
    id: number;
    name: string;
    price: string;
    description: string;
  };
}

const EditDealForm: React.FC<EditDealFormProps> = ({ deal }) => {
  const [name, setName] = useState(deal.name);
  const [price, setPrice] = useState(deal.price);
  const [description, setDescription] = useState(deal.description);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Update the deal in the database
    await fetch(`/api/deals/edit/${deal.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, price, description }),
    });

    // Redirect to the updated deal page or any other page
    router.push(`/Deals/${deal.id}`);
    toast.success("Updated Deal")
  };

  const handleDelete = async () => {
    // Delete the deal from the database
    await fetch(`/api/deals/delete/${deal.id}`, {
      method: 'DELETE',
    });

    // Redirect to the homepage
    router.push('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <Input
          type="text"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <Tiptap
          content={description}
          onUpdate={(newContent) => setDescription(newContent)}
        />
      </div>

      <div className="flex space-x-4">
        <Button type="submit">
          Save Changes
        </Button>
        <Button type="button" onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
          Delete Deal
        </Button>
      </div>
    </form>
  );
};

export default EditDealForm;
