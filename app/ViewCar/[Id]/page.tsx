import { CarCard2 } from "@/app/CarCard2";
import { db } from "@/lib/db";

interface Props {
  params:{
    Id: string
  }
}

export default async function Home({ params }: Props) {
  const cars = await db.car.findFirst({
    where:{
      id: params.Id
    }, include:{
      sensors: true
    }
  })

  return (
  <CarCard2 id={params.Id}car={cars}/>
  );
}