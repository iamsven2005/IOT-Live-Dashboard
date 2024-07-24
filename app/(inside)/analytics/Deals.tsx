
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import Link from 'next/link';
import { db } from "@/lib/db";

interface Deal {
  id: number;
  name: string;
  price: string;
  description: string;
}

const DealsList: React.FC = async() => {
  const deals = await db.deals.findMany()

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

