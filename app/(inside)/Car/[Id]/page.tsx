import AddForm from "../AddForm";
import { getCar } from "../GetId";
import { CarSensor } from "../AddForm";
import { Separator } from "@/components/ui/separator";
import { CarCard } from "../../../CarCard";
import { auth } from "@/auth";
import { Session } from "@/lib/types";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

interface Props {
  params: {
    Id: string;
  };
}

const Car = async ({ params }: Props) => {
  const car: CarSensor | null = await getCar(params.Id);
  const session = (await auth()) as Session;
  
  if (!session) {
    return redirect("/");
  }
  const admin = await db.user.findFirst({
    where:{
      email: session.user.email
    }
  })
  const isAdmin = admin?.role === "admin"
  const brands = await db.brand.findMany()
  return (<div className="flex flex-col container">{isAdmin ?( <AddForm car={car} brands={brands}/>) : (<CarCard id={params.Id} car={car} booking={car?.bookings}/>)}
 </div>);
};

export default Car;
