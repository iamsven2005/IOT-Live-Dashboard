import { db } from "@/lib/db"

export const getCar = async (Id: string) => {
    try{
        const car = await db.car.findUnique({
            where: {
                id: Id
            },
            include:{
                sensors: true
            }
        }) 
    }catch (error){
        console.log(error)
    }
}