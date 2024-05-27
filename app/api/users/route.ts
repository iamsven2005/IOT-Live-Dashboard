import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        assignedTask: true,
        role: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
