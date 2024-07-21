import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { taskId, title, file, newDetail } = await req.json();
  try {
    const updatedTask = await db.faults.update({
      where: { id: taskId },
      data: { title, file },
    });

    if (newDetail) {
      await db.faultDetails.create({
        data: {
          faultId: taskId,
          description: newDetail,
        },
      });
    }

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error updating task" }, { status: 500 });
  }
}
