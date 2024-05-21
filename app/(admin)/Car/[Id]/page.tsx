import AddForm from "../AddForm";
import { getCar } from "../GetId";
import { CarSensor } from "../AddForm";

interface Props {
  params: {
    Id: string;
  };
}

const Car = async ({ params }: Props) => {
  const car: CarSensor | null = await getCar(params.Id);
  return (<><AddForm car={car} />
 </>);
};

export default Car;
