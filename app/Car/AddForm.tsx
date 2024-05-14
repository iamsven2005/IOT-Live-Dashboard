"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Car, Sensor } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton, UploadDropzone } from "@/components/uploadthing";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Loader, XCircle } from "lucide-react";
import axios from "axios"
import UseLocation from "@/lib/hooks/uselocation";
import { ICity, IState } from "country-state-city";
interface Props {
  car: CarSensor | null
}
export type CarSensor = Car & {
  Sensor: Sensor[]
}
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters"
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters"
  }),
  image: z.string().min(3, {
    message: "Image is required"
  }),
  brand: z.string().min(3, {
    message: "Brand must be at least 3 characters"
  }),
  country: z.string().min(1, {
    message: "Indicate Country"
  }),
  parkinglot: z.string(),
  rental: z.number(),
  state: z.string().optional(),
  city: z.string().optional(),
})



const AddForm = ({ car }: Props) => {
  const [image, setImage] = useState<string | undefined>(car?.image)
  const [imageDelete, setdelete] = useState(false)
  const [state, setStates] = useState<IState[]>([])
  const [cities, setCities] = useState<ICity[]>([])

  const { getAllCountries, getCountryStates, getStateCities } = UseLocation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      rental: 0,
      description: "",
      parkinglot: "",
      brand: "",
      image: "",
      country: "",
      state: "",
      city: ""
    },
  })
  useEffect(() => {
    const selectedCountry = form.watch("country")
    const countryStates = getCountryStates(selectedCountry)
    if (countryStates) {
      setStates(countryStates)
    }
  }, [form.watch("country")])
  useEffect(() => {
    const selectedCountry = form.watch("country")
    const selectedState = form.watch("state")
    const stateCities = getStateCities(selectedCountry, selectedState)
    if (stateCities) {
      setCities(stateCities)
    }
  }, [form.watch("country"), form.watch("state")])
  function onSubmit(values: z.infer<typeof formSchema>) {

    console.log(values)
  }
  const handleDelete = (image: string) => {
    setdelete(true)
    const imageKey = image.substring(image.lastIndexOf("/") + 1)
    axios.post("/api/uploadthing/delete", { imageKey }).then((res: { data: { success: any; }; }) => {
      if (res.data.success) {
        setImage("")
        toast.success("Image deleted")
      }
    }).catch(() => {
      toast.error("Error deleting, please report to supervisor")
    }).finally(() => {
      setdelete(false)
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 container flex flex-col md:flex ">
        <h3 className="text-2lg font-semibold m-5">
          {car ? "Update your car" : "Describe your car"}
        </h3>
        <div className="flex-1 flex flex-col gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Model</FormLabel>
                <FormControl>
                  <Input placeholder="Car Model" {...field} />
                </FormControl>
                <FormDescription>
                  Provide the model of the car:
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Car Description" {...field} />
                </FormControl>
                <FormDescription>
                  Whats good?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Brand</FormLabel>
                <FormControl>
                  <Textarea placeholder="Car Brand" {...field} />
                </FormControl>
                <FormDescription>
                  Branding is important!
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="rental"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormDescription>
                  Is it reasonable for customers?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="parkinglot"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Lot</FormLabel>
                <FormControl>
                  <Input placeholder="Where?" {...field} />
                </FormControl>
                <FormDescription>
                  Put running if no designated parking.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className=" flex flex-col space-y-3">
              <FormLabel>
                Upload an Image
              </FormLabel>
              <FormDescription>
                Choose an image
              </FormDescription>
              <FormControl>
                {image ? <div className="relative max-w[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                  <Image fill src={image} alt="Car Image" className="object-contain" />
                  <Button type="button" size="icon" variant="ghost" className="absolute right-[-12px] top-0" onClick={() => handleDelete(image)}>
                    {imageDelete ? <Loader /> : <XCircle />}
                  </Button>
                </div>
                  : <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      console.log("Files: ", res);
                      setImage(res[0].url)
                      toast.success("Upload done")
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(error.message)
                    }}
                  />}
              </FormControl>
            </FormItem>)} />
            <div>
              
            </div>
        <Button type="submit" className="m-5">Submit</Button>
      </form>
    </Form>
  );
}

export default AddForm;