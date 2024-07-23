import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Session } from "@/lib/types"
import { redirect } from "next/navigation"
import { NextResponse } from "next/server"

export async function POST(req: Request){
    try{
        const body = await req.json()
        const session = (await auth()) as Session
        if(!session){
            return redirect("/");

        }
        const car = await db.car.create({
            data:{
                ...body,
            }
        })
        return NextResponse.json(car)
    }catch(error){
        console.log("/api/brands",error)
        return new NextResponse("Internal server Error", {status: 500})
    }
}