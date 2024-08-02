//@ts-nocheck
"use client"
import { useRef } from "react";
import Send from "./buttonsend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import html2pdf from "html2pdf.js";  // Import the library

const Booking = ({ booking }: any) => {
  const bookingRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (bookingRef.current) {
      const element = bookingRef.current;
      const opt = {
        margin: 0.5,
        filename: `Invoice_Booking_${booking.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      };

      // Generate PDF from the element
      html2pdf().from(element).set(opt).save();
    }
  };

  return (
    <Card className="m-5 p-5" ref={bookingRef}>  {/* Attach ref to the Card */}
      <CardHeader>
        <CardTitle>
          Invoice for booking {booking?.id}
        </CardTitle>
        <CardDescription>
          Paid by: {booking?.Name}
          <br />
          Invoice Sharable Link: {`https://iot-live-dashboard.vercel.app/view/${booking.id}`}
          <Send email={booking?.Name} id={booking.id} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CardTitle>
          Payment Intent: {booking?.paymentIntentId}
        </CardTitle>
        <CardDescription>
          Start: {new Date(booking?.startDate).toDateString()} <br />
          End: {new Date(booking?.endDate).toDateString()} <br />
          Currency: {booking?.currency} <br />
          CarId: {booking?.carId} <br />
          Car: {booking?.Car?.title}
          <br />
          Charge: {booking?.Car?.charge} <br />
        </CardDescription>
      </CardContent>
      <CardFooter>
        <CardTitle>
          Payment: {booking?.amount.toString()}
        </CardTitle>
      </CardFooter>
      <div className="flex justify-between items-center mt-4">
        <Button>
          <Link href="/bookings">Back To Bookings</Link>
        </Button>
        <Button onClick={handleDownloadPDF}>Download as PDF</Button> {/* Add Download Button */}
      </div>
    </Card>
  );
}

export default Booking;
