"use client";
import useBook from "@/lib/hooks/useBook";
import { Separator } from "@radix-ui/react-select";
import { AddressElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Booking } from "@prisma/client";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

interface Props {
  clientSecret: string;
  handleSuccess: (value: boolean) => void;
}

type DateRangeType = {
  start: Date;
  end: Date;
};

function hasOverlap(start: Date, end: Date, Range: DateRangeType[]) {
  const targetInterval = { start: startOfDay(new Date(start)), end: endOfDay(new Date(end)) };
  for (const range of Range) {
    const rangestart = startOfDay(new Date(range.start));
    const rangeend = endOfDay(new Date(range.end));
    if (
      isWithinInterval(targetInterval.start, { start: rangestart, end: rangeend }) ||
      isWithinInterval(targetInterval.end, { start: rangestart, end: rangeend }) ||
      (targetInterval.start < rangestart && targetInterval.end > rangeend)
    ) {
      return true;
    }
  }
  return false;
}

const RentalPaymentForm = ({ clientSecret, handleSuccess }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { bookingData, resetBooking } = useBook();
  const startDate = moment(bookingData?.start).format("MMMM Do YYYY");
  const endDate = moment(bookingData?.end).format("MMMM Do YYYY");
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    handleSuccess(false);
    setIsLoading(false);
  }, [stripe, clientSecret, handleSuccess]);

  if (!bookingData?.start || !bookingData?.end) return <div>Missing Rental Dates</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements || !bookingData) {
      return;
    }
    try {
      const bookings = await axios.get(`/api/booking/${bookingData.car.id}`);
      const bookingDates = bookings.data.map((booking: Booking) => {
        return {
          startDate: booking.startDate,
          endDate: booking.endDate,
        };
      });
      const overlapped = hasOverlap(bookingData.start, bookingData.end, bookingDates);
      if (overlapped) {
        setIsLoading(false);
        return toast.error("Someone has already booked this date, choose another time period or car");
      }
      stripe.confirmPayment({ elements, redirect: "if_required" }).then((result) => {
        if (!result.error) {
          axios.patch(`/api/booking/${result.paymentIntent.id}`).then((res) => {
            toast.success("Rental Reserved!");
          });
          router.refresh();
          resetBooking();
          handleSuccess(true);
          setIsLoading(false);
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong during reservation");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <Separator />
      <h2 className="font-semibold p-5 text-lg">Billing Address</h2>
      <AddressElement
        options={{
          mode: "billing",
        }}
      />
      <h2 className="font-semibold p-5 text-lg">Payment Information</h2>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <div className="flex flex-col gap-1">
        <Separator />
        <div className="flex flex-col gap-1">
          <h2 className="font-bold mb-1 text-lg">Summary</h2>
          <div>Your rent starts at 8am on {startDate}</div>
          <div>Your rent ends at 9pm on {endDate}</div>
          <div>Total Price: {bookingData?.totalPrice}</div>
        </div>
      </div>
      <Button disabled={isLoading}>Pay Now</Button>
    </form>
  );
};

export default RentalPaymentForm;
