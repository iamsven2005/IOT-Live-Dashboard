"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Booking, Car, Sensor } from "@prisma/client";
import { Loader2, Plus, Trash } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AddFormSensor } from "./AddSensorsForm";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
type props= {
    car?: Car & {
        sensors: Sensor[]
    }
    sensor: Sensor
    bookings?: Booking[]
}
const SensorCard = ({car, sensor, bookings = []}: props) => {
    const [Open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const isDetails = pathname.includes("car-details")
    const handleDialogOpen = () => {
        setOpen((prev) => !prev);
      };
      const handleSensorDelete = (sensor: Sensor) => {
        setIsLoading(true);
        const imageKey = sensor.image.substring(sensor.image.lastIndexOf("/") + 1);
        
        axios.post("/api/uploadthing/delete", { imageKey })
            .then(() => {
                return axios.delete(`/api/sensors/${sensor.id}`);
            })
            .then(() => {
                router.refresh();
                toast.success("Sensor Deleted!");
            })
            .catch(() => {
                toast.warning("Something went wrong!");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }
    
    return ( <Card>
        <Image
          alt={sensor.title}
          className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
          height="310"
          src={sensor.image}
          width="550"
        />
        <CardHeader>
          <CardTitle>{sensor.title}</CardTitle>
          <CardDescription>{sensor.description}</CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-col gap-5">
            <div>Id: {sensor.id}</div>
            <div>Threshold: {sensor.threshold}</div>
            <div>Car: {car?.title}</div>
        </CardFooter>
        {
            isDetails ? <div>
                Car Details Page
            </div> : <div className="fkex w-full justify-between">
                <Button disabled={isLoading} type="button" variant="ghost" onClick={() => handleSensorDelete(sensor)}>
                    {isLoading ? <>
                        <Loader2 className="mr-2 size-4"/>Deleting...
                    </> : <>
                        <Trash className="mr-2 size-4"/>Delete
                    </>
                    }
                </Button>
                <Dialog open={Open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Button type="button">
                    <Plus className="mr-2 size-4" /> Update sensors
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[900px] w-[90%]">
                  <DialogHeader className="flex flex-col">
                    <DialogTitle>We use these to monitor data.</DialogTitle>
                    <DialogDescription>
                      These sensors help us to manage our fleet better.
                    </DialogDescription>
                    <AddFormSensor car={car} sensors={sensor} handledialogOpen={handleDialogOpen} />

                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

        }
      </Card> );
}
 
export default SensorCard;