import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { file, status, title } = await req.json();
  try {
    const newTask = await db.faults.create({
      data: {
        file,
        status,
        title,
      },
    });
    return NextResponse.json(newTask, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error adding task" }, { status: 500 });
  }
}
