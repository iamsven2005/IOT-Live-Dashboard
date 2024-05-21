"use client"
import useBook from "@/lib/hooks/useBook"
import {StripeElementsOptions, loadStripe} from "@Stripe/stripe-js"
import { Elements } from '@stripe/react-stripe-js';
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes"
import RentalPaymentForm from "./Payment"
import { useEffect, useState } from "react"
import Image from "next/image";
const BookClient = () => {
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)
const {bookingData, clientSecret}= useBook()
const [pageLoaded, setPageLoaded] = useState(false)
const {theme} = useTheme()
useEffect(()=> {
  setPageLoaded(true)
}, [])
const options: StripeElementsOptions ={
    clientSecret,
    appearance:{
        theme:theme === "dark" ? "night" : "stripe", labels: "floating"
    }
}
const [paymentSuccess, setPaymentSuccess] = useState(false)

const handlePaymentSuccess = (value: boolean) => {
    setPaymentSuccess(value)
}
if (!paymentSuccess && (!bookingData || !clientSecret) ) return <div className="text-center">Payment Failed ...You might have cancelled your order.</div>
if(paymentSuccess) return <div className="text-center">Payment Success!</div>

    return ( 
        <div className="max-w-[700px] mx-auto"> 
        {clientSecret && bookingData &&
    <div className="mb-6">
        <h3 className="text-2xl font-semibold">
            Complete paymenmt to reserve this rental!
        </h3>
        <div>
        <Card className="w-full max-w-md">
      <Image
        alt={bookingData.car.title}
        className="rounded-t-lg object-cover w-full aspect-[4/3]"
        height="240"
        src={bookingData.car.image}
        width="400"
      />
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <CardTitle className="text-xl font-bold">{bookingData.car.title}</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            {bookingData.car.description}
          </CardDescription>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total
            <span className="font-medium text-gray-900 dark:text-gray-100">{bookingData.totalPrice}</span>
          </div>
        </div>
      </CardContent>
    </Card>
    <Elements stripe={stripePromise} options={options}>
    <RentalPaymentForm clientSecret ={clientSecret} handleSuccess = {handlePaymentSuccess}/>
    </Elements>
        </div>
    </div>}
        </div>
     );
}
 
export default BookClient;