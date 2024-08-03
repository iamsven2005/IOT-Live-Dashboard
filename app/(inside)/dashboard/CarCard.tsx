import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Car, Sensor } from "@prisma/client";
import { getStateByCodeAndCountry } from "country-state-city/lib/state";
import Image from "next/image";
import Link from "next/link";
import { Preview } from "../Car/preview";

interface Props {
    car: CarSensor | null;
  }
  
  export type CarSensor = Car & {
    sensors: Sensor[];
  };
export const CarCard = ({ car }: Props) => {
    if(!car){
        return <div>
            not found
        </div>
    }
    const state = getStateByCodeAndCountry( car?.state, car?.country)
    return (
        <Card>
            <img
                alt={car?.id}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
                height="310"
                src={car?.image}
                width="550"
            />
            <CardHeader>
                <CardTitle>{car?.title}</CardTitle>
                <CardDescription>                <Preview value={car?.description}/>
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col items-start">
                <div>
                    Rental Price: SGD {car?.rental}/day
                </div>
                <div>
                    Brand: {car?.brand}
                </div>
                <div>
                    Fuel: {car?.charge}
                </div>
                <div>
                    Drive: {car?.drive}
                </div>
                <div>
                    Location: {car?.country},{state?.name},{car?.city}
                </div>
                <div>
                    Parking: {car?.parkinglot}
                </div>
                <Separator/>
                <div className="text-xl">
                    Sensors
                </div>

                <Carousel className="m-5">
  <CarouselContent className="w-full m-5">
  {car?.sensors.map((carse) =>
<Card key={carse.id}>
    <CardTitle>{carse.title}</CardTitle>
    <CardDescription>{carse.description}</CardDescription>
    <img alt={carse.title} src={carse.image} width={310} height={100}></img>
</Card>            )}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
                <Link href={`/Car/${car?.id}`}>
                    <Button>
                    Edit
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}