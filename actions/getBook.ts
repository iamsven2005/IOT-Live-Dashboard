import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Session } from "@/lib/types";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const getBooking = async () => {
  const session = (await auth()) as Session;
  
  if (!session) {
    return redirect("/");
  }

  try {
    const bookings = await db.booking.findMany({
      where: {
        Name: session.user.email,
      },
      include: {
        Car: true,
      },
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
