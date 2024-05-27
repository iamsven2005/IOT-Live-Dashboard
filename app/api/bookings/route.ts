import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const bookings = await db.booking.findMany({include:{Car: true}});
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return new NextResponse("Failed to fetch bookings", { status: 500 });
  }
};
