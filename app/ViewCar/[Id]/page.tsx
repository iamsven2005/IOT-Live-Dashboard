import AddForm from "../AddForm";
import { getCar } from "../GetId";
import { CarSensor } from "../AddForm";
import { auth } from "@/auth";
import { Session } from "@/lib/types";
import { NextResponse } from "next/server";
import { CarCard } from "../CarCard";

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
  return (<CarCard id={params.Id} car={car} booking={car?.bookings}/>);
};

export default Car;
