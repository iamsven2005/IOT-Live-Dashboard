import AddForm from "../AddForm";
import { getCar } from "../GetId";
import { CarSensor } from "../AddForm";

import { CarCard } from "../CarCard";

interface Props {
  params: {
    Id: string;
  };
}

const Car = async ({ params }: Props) => {
  const car: CarSensor | null = await getCar(params.Id);

  return (<CarCard id={params.Id} car={car} booking={car?.bookings}/>);
};

export default Car;
