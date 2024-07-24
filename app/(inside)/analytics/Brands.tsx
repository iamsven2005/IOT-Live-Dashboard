"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brand } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function Revenue() {
  const [data, setData] = useState<{ users: Brand[] }>({ users: [] });
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm();
const router = useRouter()
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch brand data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const onSubmit = async (values: any) => {
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to create brand');
      }

      const newBrand = await response.json();
      setData((prevData) => ({ users: [...prevData.users, newBrand] }));
      reset();
      toast.success("Brand created successfully");
      revalidatePath("/analytics")
      router.refresh()
    } catch (error) {
      console.error('Failed to create brand:', error);
      toast.error("Failed to create brand");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data || !data.users.length) {
    return <div>Failed to load data.</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Car Brands</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("name")}
            placeholder="Enter brand name"
            required
          />
          <Button type="submit">Add Brand</Button>
        </form>
        <div className="mt-4 flex flex-col gap-2">
          {data.users.map((user: Brand) => (
            <Link href={`/analytics/Brands/${user.id}`} key={user.id}>
              <Button variant={"link"}>{user.name}</Button>
              
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
