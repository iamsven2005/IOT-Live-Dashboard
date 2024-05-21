import { db } from "@/lib/db"
import { toast } from "sonner"

export const getBookings = async(carid: string) =>{
    try{
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate()-1)
        const bookings = await db.booking.findMany({
            where:{
                carId:carid,
                endDate:{
                    gt: yesterday
                }
            }
        })
        return bookings
    } catch (error: any){
        toast.error(error)
    }
}