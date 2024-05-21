import { db } from "@/lib/db"
import { toast } from "sonner"

export const getCarsById = async(searchParams: {
    carid: string
}
) =>{
    try{
        const {carid} = searchParams
        const cars = await db.car.findFirst({
            where:{
                id: carid
            },
        include: {sensors: true}
    })
    return cars
}catch(error){
        toast.error("Cannot get cars right now, something went wrong.")
    }
}