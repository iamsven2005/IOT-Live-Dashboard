import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(
    req: Request, 
    {params}: {params: {id: string}}){
    try{
        if(!params.id){
            return new NextResponse("payment id is required", {status: 400})
        }
        const booking = await db.booking.update({
            where:{
                paymentIntentId: params.id, 
            },
            data: {pay: true}
        })
        return NextResponse.json(booking)
    } catch(error){
        console.log("car/carid:PATCH :",error)
        return new NextResponse("Internal server error", {status: 500})
    }
}
export async function DELETE(
    req: Request, 
    {params}: {params: {id: string}}){
    try{
        if(!params.id){
            return new NextResponse("booking id is required", {status: 400})
        }
        const booking = await db.booking.delete({
            where:{
                paymentIntentId: params.id, 
            }
        })
        return NextResponse.json(booking)
    } catch(error){
        console.log("car/bookingid:DELETE :",error)
        return new NextResponse("Internal server error", {status: 500})
    }
}
export async function GET(
    req: Request, 
    {params}: {params: {id: string}}){
    try{
        if(!params.id){
            return new NextResponse("booking id is required", {status: 400})
        }
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate()-1)
        const booking = await db.booking.findMany({
            where:{
                pay: true,
                carId: params.id, 
                endDate:{
                    gt: yesterday
                }
            }
        })
        return NextResponse.json(booking)
    } catch(error){
        console.log("car/bookingid:GET",error)
        return new NextResponse("Internal server error", {status: 500})
    }
}