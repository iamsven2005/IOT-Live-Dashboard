import Tiptap from "@/components/Tiptap";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import EditDealForm from "./EditForm";

interface Props {
  params: {
    id: string;
  };
}

export default async function Home({ params }: Props) {
  const id = parseInt(params.id, 10);
  const deal = await db.deals.findFirst({
    where: {
      id: id,
    },
  });

  if (!deal) {
    return <div>Deal not found</div>;
  }

  return (
    <Card className="m-5 p-5">
      <CardHeader>
        <CardTitle>{deal.name}</CardTitle>
        <CardDescription>{deal.price}</CardDescription>
      </CardHeader>
      <Tiptap content={deal.description || ''} editable={false} />
      <EditDealForm deal={deal} />
    </Card>
  );
}
