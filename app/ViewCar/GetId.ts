import { db } from "@/lib/db"; 
import { CarSensor } from "./AddForm";

export const getCar = async (id: string): Promise<CarSensor | null> => {
  try {
    const car = await db.car.findUnique({
      where: { id },
      include: { sensors: true },
    });

    if (!car) {
      return null;
    }

    return car as unknown as CarSensor;
  } catch (error) {
    console.error(error);
    return null;
  }
};
