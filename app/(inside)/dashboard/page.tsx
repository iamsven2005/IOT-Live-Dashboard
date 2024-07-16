import { getCars } from "@/actions/getCars";
import { CarCard } from "./CarCard";

interface Props {
  searchParams: {
    title: string;
    country: string;
    state: string;
    city: string;
    brand: string
  };
}

export default async function Home({ searchParams }: Props) {
  const cars = await getCars(searchParams);
  if (!cars) {
    return <div>No Cars Found</div>;
  }

  return (
        <div className="grid grid-cols 1 sm:grid-cols-2 lg: grid-cols-3 gap-x-8 gap-y-12 m-5">
            {cars.map((car) =>
              <CarCard key={car.id} car={car}/>
            )}
        </div>
  );
}
