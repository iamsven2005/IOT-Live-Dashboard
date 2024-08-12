import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Car, Sensor } from "@prisma/client";
import { getStateByCodeAndCountry } from "country-state-city/lib/state";
import Image from "next/image";
import Link from "next/link";
import { Preview } from "../Car/preview";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface Props {
  car: CarSensor | null;
}

export type CarSensor = Car & {
  sensors: Sensor[];
};

export const CarCard = ({ car }: Props) => {
  if (!car) {
    return <div>not found</div>;
  }

  const state = getStateByCodeAndCountry(car?.state, car?.country);

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
    <Card className="overflow-hidden">
      <img
        alt={car?.id}
        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
        height="310"
        src={car?.image}
        width="550"
      />
      <CardContent>
      <AccordionTrigger><CardTitle>{car?.title}</CardTitle></AccordionTrigger>

      <AccordionContent>
      <CardDescription>
          <Preview value={car?.description} />
        </CardDescription>
        <div>Rental Price: SGD {car?.rental}/day</div>
        <div>Brand: {car?.brand}</div>
        <div>Fuel: {car?.charge}</div>
        <div>Drive: {car?.drive}</div>
        <div>
          Location: {car?.country},{state?.name},{car?.city}
        </div>
        <div>Parking: {car?.parkinglot}</div>
        <Separator />
        <div className="text-xl">Sensors</div>

        <Carousel className="w-full overflow-hidden">
          <CarouselContent className="gap-2">
            {car?.sensors.map((carse) => (
              <Card key={carse.id} className="p-5 w-full">
                <CardTitle>{carse.title}</CardTitle>
                <CardDescription>{carse.description}</CardDescription>
                <img alt={carse.title} src={carse.image} width={310} height={100} className="rounded-md object-cover" />
              </Card>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <Link href={`/Car/${car?.id}`}>
          <Button className="mt-3">Edit</Button>
        </Link>
        </AccordionContent>

      </CardContent>
    </Card>
      </AccordionItem>
      </Accordion>

  );
};
