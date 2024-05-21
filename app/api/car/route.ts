import { auth } from "@/auth"
import { db } from "@/lib/db"
import { Session } from "@/lib/types"
import { NextResponse } from "next/server"

export async function POST(req: Request){
    try{
        const body = await req.json()
        const session = (await auth()) as Session
        if(!session){
            return new NextResponse("unauthorized", {status: 401})
        }
        const car = await db.car.create({
            data:{
                ...body,
            }
        })
        return NextResponse.json(car)
    }catch(error){
        console.log("/api/car",error)
        return new NextResponse("Internal server Error", {status: 500})
    }
}