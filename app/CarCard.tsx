"use client";

import { Accordion, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Booking, Car, Sensor } from "@prisma/client";
import { AccordionContent } from "@radix-ui/react-accordion";
import { getStateByCodeAndCountry } from "country-state-city/lib/state";
import Image from "next/image";
import { DateRange } from "react-day-picker";
import React, { useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import useBook from "@/lib/hooks/useBook";
import { redirect, useRouter } from "next/navigation";
import useDisabledDates from "@/actions/nah";
import { Picker } from "./Picker";
import { Preview } from "./(inside)/Car/preview";
import Link from "next/link";

interface Props {
  car: CarSensor | null;
  id: string;
  booking?: Booking[];
}

export type CarSensor = Car & {
  sensors: Sensor[];
};

export const CarCard = ({ car, id, booking = [] }: Props) => {
  const { setCar, paymentIntent, setclientSecret, setpaymentIntent } = useBook();
  const state = getStateByCodeAndCountry(car?.state || "", car?.country || "");
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(car?.rental || 0);
  const [days, setDays] = useState(1);
  const [bookings, setBooking] = useState(false);
  const router = useRouter();

  const dates = useDisabledDates({ carId: car?.id || "", booking });

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);
      setDays(dayCount);
      if (dayCount && car?.rental) {
        setTotalPrice(dayCount * car.rental);
      } else {
        setTotalPrice(car?.rental || 0);
      }
    }
  }, [date, car?.rental]);

  if (!car) {
    return redirect("/");
  }
  

  const handleBooking = () => {
    if (!id) return toast.error("Not Logged In");
    if (date?.from && date?.to) {
      setBooking(true);
      const bookingData = {
        car,
        totalPrice,
        start: date.from,
        end: date.to,
      };
      setCar(bookingData);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: {
            startDate: date.from,
            endDate: date.to,
            amount: totalPrice,
            carId: car.id,
          },
          payment_intent_id: paymentIntent,
        }),
      })
        .then((res) => {
          setBooking(false);
          if (res.status === 401) {
            return router.push("/");
          }
          return res.json();
        })
        .then((data) => {
          setclientSecret(data.paymentIntent.client_secret);
          setpaymentIntent(data.paymentIntent.id);
          router.push("/book-car");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      toast.error("No Date Selected");
    }
  };

  return (
    <Card className="gap-2">
      <img
        alt={car?.id || "Car image"}
        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
        height="310"
        src={car?.image || ""}
        width="540"
      />
      <CardHeader>
        <CardTitle>{car?.title}</CardTitle>
        <CardDescription><Preview value={car?.description}/>
          </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-start">
        <Separator />
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>Details</AccordionTrigger>
            <AccordionContent>
            <div>Rental Price: SGD {car?.rental}/day</div>
        <div>Brand: {car?.brand}</div>
        <div>Fuel: {car?.charge}</div>
        <div>Drive: {car?.drive}</div>
        <div>Location: {car?.country}, {state?.name}, {car?.city}</div>
        <div>Parking: {car?.parkinglot}</div>
            </AccordionContent>
          </AccordionItem>
          <Separator />
          <AccordionItem value="item-2">
            <AccordionTrigger>Sensors</AccordionTrigger>
            <AccordionContent>
              <Carousel className="m-5">
                <CarouselContent className="m-5 gap-5">
                  {car?.sensors.map((carse) => (
                    <Card key={carse.id} className="p-5 w-full">
                      <CardTitle>{carse.title}</CardTitle>
                      <CardDescription>{carse.description}</CardDescription>
                      <img alt={carse.title} src={carse.image || ""} width={310} height={100} />
                    </Card>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button asChild>
        <Link href={`/review/${car.id}`}>
        See Reviews
        </Link>
        </Button>
        <div>Rental Dates</div>
        <Picker date={date} setDate={setDate} disabledDates={dates} />
        <div>Total Price: <span>${totalPrice}</span> for <span>{days} days</span></div>
        <Button disabled={bookings} onClick={handleBooking}>
          {bookings ? <div><Loader2 className="mr-2 size-4" />Booking</div> : <div ><Wand2 className="mr-2 size-4" />Book now</div>}
        </Button>

      </CardFooter>
      <div className="m-5 p-5 flex-wrap gap-5">

      </div>
    </Card>
  );
};
