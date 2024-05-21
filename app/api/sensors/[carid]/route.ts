import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, {params}: {params: {carid: string}}){
    try{
        const body = await req.json()
        if(!params.carid){
            return new NextResponse("sensor id is required", {status: 400})
        }
        const car = await db.sensor.update({
            where:{
                id: params.carid, 
            },
            data: {...body}
        })
        return NextResponse.json(car)
    } catch(error){
        console.log("sensor/carid:PATCH :",error)
        return new NextResponse("Internal server error", {status: 500})
    }
}
export async function DELETE(req: Request, { params }: { params: { carid: string } }) {
    try {
        if (!params.carid) {
            return new NextResponse("Sensor id is required", { status: 400 });
        }

        const sensor = await db.sensor.delete({
            where: {
                id: params.carid,
            },
        });

        return NextResponse.json(sensor);
    } catch (error) {
        console.error("sensor/carid:DELETE:", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}