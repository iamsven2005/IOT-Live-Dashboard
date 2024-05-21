import { db } from "@/lib/db"
import { toast } from "sonner"
import {auth} from "@/auth"
export const getCars = async(searchParams: {
    title: string
    country: string
    state: string
    city: string
}
) =>{
    try{
        const {title, country, state, city} = searchParams
        const cars = await db.car.findMany({
            where:{
                title:{
                    
                    contains: title
                },
                country,
                state,
                city,
            },
        include: {sensors: true,bookings: true}
    })
    return cars
}catch(error){
        toast.error("Cannot get cars right now, something went wrong.")
    }
}