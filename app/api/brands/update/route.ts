import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { id, name } = await req.json();

    // Find the current brand name before updating
    const existingBrand = await db.brand.findUnique({
      where: { id },
      select: { name: true },
    });

    if (!existingBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Update the brand name
    const updatedBrand = await db.brand.update({
      where: { id },
      data: { name },
    });

    // Update the brand name in the cars that use this brand
    await db.car.updateMany({
      where: {
        brand: existingBrand.name,
      },
      data: {
        brand: name,
      },
    });

    return NextResponse.json(updatedBrand, { status: 200 });
  } catch (error) {
    console.error("Error updating brand and car brands:", error);
    return NextResponse.json({ error: "Failed to update brand" }, { status: 500 });
  }
}
