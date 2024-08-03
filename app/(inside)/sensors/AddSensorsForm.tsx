"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UploadDropzone } from "@/components/uploadthing";
import { zodResolver } from "@hookform/resolvers/zod";
import { Car, Sensor } from "@prisma/client";
import axios from "axios";
import { Loader, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {
  car?: Car & {
    sensors: Sensor[];
  };
  sensors?: Sensor;
  handledialogOpen?: () => void;
};

const FormSchema = z.object({
  title: z.string().min(3, {
    message: "Less than 3 characters",
  }),
  description: z.string().min(3, {
    message: "Less than 3 characters",
  }),
  installation: z.string().min(3, {
    message: "Less than 3 characters",
  }),
  threshold: z.coerce.number().min(1, { message: "Sensor value must be added" }),
  image: z.string().min(3, {
    message: "Image must be added",
  }),
});

export const AddFormSensor = ({ car, sensors, handledialogOpen }: Props) => {
  const [isDeleting, setisDeleting] = useState(false);
  const [image, setImage] = useState<string | undefined>(sensors?.image);
  const [imageDelete, setdelete] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: sensors
      ? {
          title: sensors.title || "",
          description: sensors.description || "",
          image: sensors.image || "",
          threshold: Number(sensors.threshold) || 0,
          installation: sensors.installation || "",
        }
      : {
          title: "",
          description: "",
          image: "",
          threshold: 0,
          installation: "",
        },
  });

  function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsloading(true);
    if (car && sensors) {
      axios.patch(`/api/sensors/${sensors.id}`, values).then((res) => {
        toast.success("Car updated");
        router.refresh();
        setIsloading(false);
        handledialogOpen && handledialogOpen();
      });
    } else {
      if (!car?.id) return;
      axios
        .post("/api/sensors", { ...values, carId: car.id })
        .then((res) => {
          toast.success("Successfully Created");
          router.push(`/dashboard`);
          setIsloading(false);
        })
        .catch((error) => {
          toast.error("Error for adding", error);
        });
      setIsloading(false);
    }
  }

  useEffect(() => {
    if (typeof image === "string") {
      form.setValue("image", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [image, form]);

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
    <div className="max-h-[75vh] overflow-y-auto px-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sensor Name</FormLabel>
                <FormControl>
                  <Input placeholder="Light Sensor" {...field} />
                </FormControl>
                <FormDescription>Provide the name of the sensor:</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sensor Description</FormLabel>
                <FormControl>
                  <Input placeholder="Bright and shiny" {...field} />
                </FormControl>
                <FormDescription>Provide the description of the sensor:</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="installation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sensor Installation</FormLabel>
                <FormControl>
                  <Input placeholder="How to install and use this sensor" {...field} />
                </FormControl>
                <FormDescription>Provide the installation of the sensor:</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-3">
                <FormLabel>Upload an Image</FormLabel>
                <FormDescription>Choose an image</FormDescription>
                <FormControl>
                  {image ? (
                    <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4">
                      <img fill src={image} alt="Sensor Image" className="object-contain" />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute right-[-12px] top-0"
                        onClick={() => handleDelete(image)}
                      >
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
          <div className="flex flex-row gap-6">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="threshold"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acceptable value</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>
                    <FormDescription>Provide the value of the sensor:</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <Button disabled={isLoading} type="submit">
                Submit
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};
