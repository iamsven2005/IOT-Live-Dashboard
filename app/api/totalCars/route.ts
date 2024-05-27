import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const count = await db.car.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching car count:", error);
    return new NextResponse("Failed to fetch car count", { status: 500 });
  }
};
