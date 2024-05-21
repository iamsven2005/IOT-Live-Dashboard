import { Booking } from "@prisma/client";
import { eachDayOfInterval } from "date-fns";
import { useMemo } from "react";

interface Props {
  carId: string;
  booking: Booking[];
}

const useDisabledDates = ({ carId, booking }: Props) => {
  const disabledDates = useMemo(() => {
    let dates: Date[] = [];
    const carBookings = booking.filter(booking => booking.carId === carId && booking.pay);
    carBookings.forEach(booking => {
      const range = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });
      dates = [...dates, ...range];
    });
    return dates;
  }, [carId, booking]);

  return disabledDates;
};

export default useDisabledDates;
