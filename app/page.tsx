import { getCars } from "@/actions/getCars";
import { CarCard } from "./(admin)/CarCard";
import { auth } from "@/auth";
import { Session } from "@/lib/types";
import { NextResponse } from "next/server";
import Search from "@/actions/Search";


interface Props {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
  };
}

export default async function Home({ searchParams }: Props) {
  const cars = await getCars(searchParams);
  if (!cars) {
    return <div>No Cars Found</div>;
  }
  const session = (await auth()) as Session
  if (!session) {
    return new NextResponse("unauthorized", { status: 401 })
  }
  const id = session.user.id
  return (<div className="flex flex-col">
    <div>
      <Search />
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 m-5">
      {cars.map((car) =>
        <CarCard key={car.id} car={car} id={id} booking={car.bookings} />
      )}
    </div>
  </div>
  );
}
