import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const bookings = await db.booking.findMany({
      select: {
        amount: true,
      },
    });

    if (!bookings || bookings.length === 0) {
      return new NextResponse("No bookings found", { status: 404 });
    }

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.amount, 0);
    const bookingCount = bookings.length;

    return NextResponse.json({ totalRevenue, bookingCount });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
