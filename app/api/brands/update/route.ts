import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();
    const updatedBrand = await db.brand.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedBrand, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}
