import Tiptap from "@/components/Tiptap";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";

interface Props {
  params: {
    id: string; // Change to string to match the incoming route parameter type
  };
}

export default async function Home({ params }: Props) {
  const id = parseInt(params.id, 10); // Parse the id to an integer
  const Deal = await db.deals.findFirst({
    where: {
      id: id,
    },
  });

  return (
    <Card className="m-5 p-5">
      <CardHeader>
        <CardTitle>{Deal?.name}</CardTitle>
        <CardDescription>{Deal?.price}</CardDescription>
      </CardHeader>
      <Tiptap content={Deal?.description || ''} editable={false}/>
    </Card>
  );
}
