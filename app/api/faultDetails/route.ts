import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { faultId, description } = await req.json();
  try {
    const newDetail = await db.faultDetails.create({
      data: {
        faultId,
        description,
      },
    });
    return NextResponse.json(newDetail, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding fault detail" }, { status: 500 });
  }
}
