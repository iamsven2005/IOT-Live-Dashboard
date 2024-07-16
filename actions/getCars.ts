import { db } from "@/lib/db"
import { toast } from "sonner"
import {auth} from "@/auth"
export const getCars = async(searchParams: {
    title: string
    brand: string
}
) =>{
    try{
        const {title, brand} = searchParams
        const cars = await db.car.findMany({
            where:{
                title:{
                    contains: title
                },
                brand:{
                    contains: brand
                }
                
            },
        include: {sensors: true,bookings: true}
    })
    return cars
}catch(error){
        console.log(error)
    }
}