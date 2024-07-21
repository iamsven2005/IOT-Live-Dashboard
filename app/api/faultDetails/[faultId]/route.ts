import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { faultId: string } }) {
  const { faultId } = params;
  try {
    const faultDetails = await db.faultDetails.findMany({
      where: { faultId },
    });
    return NextResponse.json(faultDetails, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error fetching fault details" }, { status: 500 });
  }
}
