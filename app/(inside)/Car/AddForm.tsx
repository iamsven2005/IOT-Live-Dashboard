"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Booking, Car, Sensor } from "@prisma/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadDropzone } from "@/components/uploadthing";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Eye, Loader, Plus, Terminal, Trash, XCircle } from "lucide-react";
import axios from "axios";
import UseLocation from "@/lib/hooks/uselocation";
import { ICity, IState } from "country-state-city";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddFormSensor } from "../sensors/AddSensorsForm";
import { Separator } from "@/components/ui/separator";
import SensorCard from "../sensors/sensorCard";

interface Props {
  car: CarSensor | null;
}

export type CarSensor = Car & {
  sensors: Sensor[];
  bookings: Booking[];
};

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters",
  }),
  image: z.string().min(3, {
    message: "Image is required",
  }),
  brand: z.string().min(3, {
    message: "Brand must be at least 3 characters",
  }),
  country: z.string().min(1, {
    message: "Indicate Country",
  }),
  parkinglot: z.string(),
  rental: z.number(),
  drive: z.string(),
  charge: z.string(),
  state: z.string().optional(),
  city: z.string().optional(),
});

const AddForm = ({ car }: Props) => {
  const [image, setImage] = useState<string | undefined>(car?.image);
  console.log(car?.description);
  const [imageDelete, setdelete] = useState(false);
  const [state, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsloading] = useState(false);
  const [isDeleting, setisDeleting] = useState(false);
  const router = useRouter();
  const { getAllCountries, getCountryStates, getStateCities } = UseLocation();
  const [Open, setOpen] = useState(false);
  const countries = getAllCountries();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: car?.title || "",
      rental: car?.rental || 0,
      description: car?.description || "",
      parkinglot: car?.parkinglot || "",
      brand: car?.brand || "",
      image: car?.image || "",
      country: car?.country || "",
      state: car?.state || "",
      city: car?.city || "",
      drive: car?.drive || "",
      charge: car?.charge || "",
    },
  });

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [image]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
  }, [form.watch("country")]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const selectedState = form.watch("state");
    const stateCities = getStateCities(selectedCountry, selectedState);
    if (stateCities) {
      setCities(stateCities);
    }
  }, [form.watch("country"), form.watch("state")]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsloading(true);
    if (car) {
      axios.patch(`/api/car/${car.id}`, values).then((res) => {
        toast.success("Car updated");
        router.push(`/Car/${res.data.id}`);
        setIsloading(false);
      });
    } else {
      axios
        .post("/api/car", values)
        .then((res) => {
          toast.success("Successfully Created");
          router.push(`/Car/${res.data.id}`);
          setIsloading(false);
        })
        .catch((error) => {
          toast.error("Error for adding", error);
        });
      setIsloading(false);
    }
  }

  const handleDialogOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleDeleteCar = async (car: CarSensor) => {
    setisDeleting(true);
    const getImageKey = (src: string) => src.substring(src.lastIndexOf("/") + 1);
    try {
      const imageKey = getImageKey(car.image);
      await axios.post(`/api/uploadthing/delete`, { imageKey });
      await axios.delete(`/api/car/${car.id}`);
      setisDeleting(false);
      toast.success("Car deleted");
      router.push("/Car/new");
    } catch (error: any) {
      console.log(error);
      setisDeleting(false);
      toast.error(`Delete error ${error.message}`);
    }
  };

  const handleDelete = (image: string) => {
    setdelete(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then((res: { data: { success: any } }) => {
        if (res.data.success) {
          setImage("");
          toast.success("Image deleted");
        }
      })
      .catch(() => {
        toast.error("Error deleting, please report to supervisor");
      })
      .finally(() => {
        setdelete(false);
      });
  };

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
        <div className="flex-1 flex flex-col gap-6">
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
        <div className="flex-1 flex flex-col gap-6">
          <FormField
            control={form.control}
            name="rental"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Car Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)} // Ensuring the value is a number
                  />
                </FormControl>
                <FormDescription>Is it reasonable for customers?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-1 flex flex-col gap-6">
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
                {image ? (
                  <div className="relative max-w[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                    <Image fill src={image} alt="Car Image" className="object-contain" />
                    <Button type="button" size="icon" variant="ghost" className="absolute right-[-12px] top-0" onClick={() => handleDelete(image)}>
                      {imageDelete ? <Loader /> : <XCircle />}
                    </Button>
                  </div>
                ) : (
                  <UploadDropzone
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                      console.log("Files: ", res);
                      setImage(res[0].url);
                      toast.success("Upload done");
                    }}
                    onUploadError={(error: Error) => {
                      toast.error(error.message);
                    }}
                  />
                )}
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex-1 flex flex-col gap6">
          <div className="grid grid-cols-1 md:grid-cols-6">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Country</FormLabel>
                  <FormDescription>
                    What country is the rental car in?
                  </FormDescription>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-backgound">
                      <SelectValue placeholder="Select" defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem value={country.isoCode} key={country.isoCode}>{country.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select State</FormLabel>
                  <FormDescription>
                    What State is the rental car in?
                  </FormDescription>
                  <Select
                    disabled={isLoading || state.length < 1}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-backgound">
                      <SelectValue placeholder="Select" defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      {state.map((state) => (
                        <SelectItem value={state.isoCode} key={state.isoCode}>{state.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select city</FormLabel>
                  <FormDescription>
                    What city is the rental car in?
                  </FormDescription>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-backgound">
                      <SelectValue placeholder="Select" defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem value={city.name} key={city.name}>{city.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="drive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select</FormLabel>
                  <FormDescription>
                    Automatic or manual?
                  </FormDescription>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-backgound">
                      <SelectValue placeholder="Select" defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="charge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select</FormLabel>
                  <FormDescription>
                    What type of fuel?
                  </FormDescription>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="bg-backgound">
                      <SelectValue placeholder="Select" defaultValue={field.value} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hydrogen">Hydrogen</SelectItem>
                      <SelectItem value="Petrol">Petrol</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </div>
        {car && (<Dialog open={Open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button type="button">
              <Plus className="mr-2 size-4" /> Add sensors
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[900px] w-[90%]">
            <DialogHeader className="flex flex-col">
              <DialogTitle>We use these to monitor data.</DialogTitle>
              <DialogDescription>
                These sensors help us to manage our fleet better.
              </DialogDescription>
              <AddFormSensor car={car} handledialogOpen={handleDialogOpen} />

            </DialogHeader>
          </DialogContent>
        </Dialog>
        )}
        {car && (
          <Button
            onClick={() => handleDeleteCar(car)}
            variant="ghost"
            type="button"
            className="max-w-[150px]"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader className="mr-2 size-4" />
                Deleting
              </>
            ) : (
              <>
                <Trash className="mr-2 size-4" />
                Delete
              </>
            )}
          </Button>
        )}
        <Button type="submit" className="m-5" disabled={isLoading}>
          Submit
        </Button>

      </form>
      {car && <div>
        <Separator />
        <h3 className="text-lg font-semibold my-4">
          Sensors
        </h3>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {car.sensors.map(sensors => {
            return <SensorCard key={sensors.id} car={car} sensor={sensors} />
          })}
        </div></div>}
    </Form>
  );
};

export default AddForm;
