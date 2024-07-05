import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Session } from "@/lib/types";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const users = await db.brand.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
export const POST = async (req: Request) => {
    try {
        const body = await req.json()
        const session = (await auth()) as Session
        if(!session){
            return new NextResponse("unauthorized", {status: 401})
        }
        const users = await db.brand.create({
        data:{
            ...body,
        }
    })
  
      return NextResponse.json({ users });
    } catch (error) {
      console.error("Error fetching users:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  