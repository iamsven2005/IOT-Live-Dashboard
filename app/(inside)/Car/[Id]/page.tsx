import AddForm from "../AddForm";
import { getCar } from "../GetId";
import { CarSensor } from "../AddForm";
import { Separator } from "@/components/ui/separator";
import { CarCard } from "../../../CarCard";
import { auth } from "@/auth";
import { Session } from "@/lib/types";
import { NextResponse } from "next/server";

interface Props {
  params: {
    Id: string;
  };
}

const Car = async ({ params }: Props) => {
  const car: CarSensor | null = await getCar(params.Id);
  const session = (await auth()) as Session;
  
  if (!session) {
    return new NextResponse("unauthorized", { status: 401 });
  }
  return (<div className="flex flex-col container">{session.user.email == process.env.ADMIN ?( <AddForm car={car} />) : (<CarCard id={params.Id} car={car} booking={car?.bookings}/>)}
 </div>);
};

export default Car;
