import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Session } from "@/lib/types";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10"
});

export async function POST(req: Request) {
  try {
    const session = (await auth()) as Session;
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { booking, payment_intent_id } = body;

    if (!booking) {
      console.error("Booking data is null:", body);
      return new NextResponse("Invalid booking data", { status: 400 });
    }

    const bookingData = {
      ...booking,
      amount: booking.amount,
      Name: session.user.email,
      currency: "sgd",
      paymentIntentId: payment_intent_id
    };

    let foundBooking;

    if (payment_intent_id) {
      foundBooking = await db.booking.findUnique({
        where: { paymentIntentId: payment_intent_id }
      });
    }

    if (foundBooking && payment_intent_id) {
      const currentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
      if (currentIntent) {
        const paymentIntent = await stripe.paymentIntents.update(payment_intent_id, {
          amount: booking.amount * 100,
        });

        const res = await db.booking.update({
          where: { paymentIntentId: payment_intent_id },
          data: bookingData
        });

        if (!res) {
          console.error("Failed to update booking in database:", bookingData);
          return NextResponse.error();
        }

        return NextResponse.json({ paymentIntent: paymentIntent });
      }
    } else {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: booking.amount * 100,
        currency: bookingData.currency,
        automatic_payment_methods: { enabled: true }
      });

      bookingData.paymentIntentId = paymentIntent.id;

      await db.booking.create({
        data: bookingData
      });

      return NextResponse.json({ paymentIntent });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  } catch (error) {
    console.error("Error processing booking:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
