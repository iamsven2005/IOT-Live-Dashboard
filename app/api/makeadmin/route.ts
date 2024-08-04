// In the same directory as your other API files, create `makeAdmin.ts` or similar.
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  try {
    await db.user.update({
      where: { id: userId },
      data: { role: "admin" },
    });
    const response = NextResponse.json({ message: "User promoted to admin successfully" });
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");
    response.headers.set("Surrogate-Control", "no-store");
    return response;
  } catch (error) {
    const errorResponse = NextResponse.json({ error: "Failed to promote user to admin" }, { status: 500 });
    errorResponse.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    errorResponse.headers.set("Pragma", "no-cache");
    errorResponse.headers.set("Expires", "0");
    errorResponse.headers.set("Surrogate-Control", "no-store");
    return errorResponse;
  }
}
