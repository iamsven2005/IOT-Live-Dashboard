import { getBooking } from "@/actions/getBook";
import { BookingCards } from "./BookingCards";
import { Booking, Car } from "@prisma/client";

const Mybookings = async () => {
  const response = await getBooking();

  if (response.status !== 200) {
    return <div>{await response.text()}</div>;
  }

  const bookingsmade = await response.json();

  if (!bookingsmade || bookingsmade.length === 0) {
    return <div>No Bookings Found</div>;
  }

  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-xl md:text-2xl font-semibold m-6">
        Here are the bookings you made
      </h2>
      <div className="flex flex-col container">
        {Array.isArray(bookingsmade) && bookingsmade.map((booking: Booking & { Car: Car }) => (
          <BookingCards key={booking.id} booking={booking} />
        ))}
      </div>
    </div>
  );
};

export default Mybookings;
