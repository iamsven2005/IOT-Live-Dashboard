import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const getAllBooking = async () => {
  try {
    const bookings = await db.booking.findMany({
      orderBy: {
        booked: "desc",
      },
    });

    if (!bookings) {
      return new NextResponse("No bookings found", { status: 404 });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
