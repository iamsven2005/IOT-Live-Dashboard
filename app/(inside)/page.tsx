import { getCars } from "@/actions/getCars";
import { CarCard } from "../CarCard";
import { auth } from "@/auth";
import { Session } from "@/lib/types";
import { redirect } from "next/navigation";
import Search from "@/actions/Search";
import SendEmailForm from "@/components/SendEmailForm";
import { db } from "@/lib/db";

interface Props {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
    brand: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const cars = await getCars(searchParams);
  if (!cars) {
    return <div>No Cars Found</div>;
  }
  const session = (await auth()) as Session;
  if (!session) {
    return redirect("/login");
  }
  const brands = await db.brand.findMany();

  const id = session.user.id;
  return (
    <div className="flex flex-col">
      <div>
        <Search brands={brands}/>
      </div>
      <SendEmailForm />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 m-5">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} id={id} booking={car.bookings} />
        ))}
      </div>
    </div>
  );
}
