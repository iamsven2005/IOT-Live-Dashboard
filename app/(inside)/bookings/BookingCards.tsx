"use client"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import UseLocation from "@/lib/hooks/uselocation";
import { Booking, Car } from "@prisma/client";
import { differenceInCalendarDays } from "date-fns";
import moment from "moment";
import { useState } from "react";

type Props = {
  booking: Booking & { Car: Car | null };
};

export const BookingCards = ({ booking }: Props) => {
  const [payment, setpayment] = useState(false);
  const { getCountrybyCode, getStateByCode } = UseLocation();
  const { Car } = booking;

  if (!Car) {
    return (
      <Card>
        <CardContent>
          <CardTitle>Car not found</CardTitle>
          <CardDescription>
            <div>Booking ID: {booking.id}</div>
          </CardDescription>
        </CardContent>
      </Card>
    );
  }

  const country = getCountrybyCode(Car.country);
  const state = getStateByCode(Car.country, Car.state);
  const startDate = moment(booking?.startDate).format("MMMM Do YYYY");
  const endDate = moment(booking?.endDate).format("MMMM Do YYYY");
  const dayCount = differenceInCalendarDays(booking.endDate, booking.startDate);

  return (
    <Card className="m-5 p-5">
      <CardContent>
        <CardTitle>{Car.title}</CardTitle>
        <CardDescription>
          <div>Location: {country?.name}, {state?.name}</div>
          <div>Start: {startDate}</div>
          <div>End: {endDate}</div>
          <div>Total: {dayCount} days</div>
        </CardDescription>
      </CardContent>
    </Card>
  );
};
