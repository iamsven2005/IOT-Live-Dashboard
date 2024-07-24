import { CardTitle, CardHeader, CardContent, Card, CardDescription } from "@/components/ui/card"
import Sensors from "./Sensors"
import Revenue from "./Revenue"
import AllUsers from "./User"
import TotalCars from "./Total"
import  Bookings from "./bookings"
import Brands from "./Brands"
import Deals from "./Deals"
import Link from "next/link"
import { Chart } from "./Sensor"
import AIdash from "./AI";
import { Button } from "@/components/ui/button"
export default function Component() {


  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-8">
        <TotalCars/>

        <Card>
          <CardHeader>
            <CardTitle>Under Maintenance</CardTitle>
            <WrenchIcon className="size-8 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">5</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Being serviced</p>
            <Link href="/faults">
            <Button>
            View More
            </Button>
            </Link>
          </CardContent>
        </Card>

        <Revenue/>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Chart/>
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-6 py-8">
        
            <Sensors />
         

        <Deals/>

        <Bookings/>

        <Brands/>

        <AllUsers/>
        <AIdash/>
      </div>
    </>
  )
}


function WrenchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}