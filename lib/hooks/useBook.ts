import { Car } from "@prisma/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Props {
  bookingData: CarType | null;
  paymentIntent: string | null;
  clientSecret: string | undefined;
  setCar: (data: CarType) => void;
  setpaymentIntent: (paymentIntent: string) => void;
  setclientSecret: (clientSecret: string) => void;
  resetBooking: () => void;
}

type CarType = {
  car: Car;
  totalPrice: number;
  start: Date;
  end: Date;
};

const useBook = create<Props>()(
  persist(
    (set) => ({
      bookingData: null,
      paymentIntent: null,
      clientSecret: undefined,
      setCar: (data) => set({ bookingData: data }),
      setpaymentIntent: (paymentIntent) => set({ paymentIntent }),
      setclientSecret: (clientSecret) => set({ clientSecret }),
      resetBooking: () => set({
        bookingData: null,
        paymentIntent: null,
        clientSecret: undefined,
      }),
    }),
    {
      name: "BookCar", // name of the item in the storage (must be unique)
      getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
    }
  )
);

export default useBook;
