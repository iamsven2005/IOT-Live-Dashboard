import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest){
    const body = await req.json()
    const {taskId, newStatus} = body
    const updatedTask = await db.faults.update({
        where: {id: taskId},
        data: {status: newStatus}
    })
    return NextResponse.json({updatedTask})
}