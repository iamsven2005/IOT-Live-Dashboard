
import { db } from "@/lib/db";
import Booking from "./booking";


interface Props {
    params: {
        booking: string
    }
}
const Page = async ({ params }: Props) => {
    const booking = await db.booking.findFirst({
        where: {
            id: params.booking
        },
        include:{
            Car: true
        }
    })

    return (
        <Booking booking={booking}/>
    );
}

export default Page;