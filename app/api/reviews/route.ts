import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { Session } from '@/lib/types';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

// Handle POST requests
export async function POST(request: Request) {
    const session = (await auth()) as Session;
  
    if (!session) {
      return redirect("/");
    }
    const email = session.user.email
  try {
    const { reviewdata, vote, carId } = await request.json();

    const newReview = await prisma.review.create({
      data: {
        review: reviewdata,
        vote,
        carId,
        email
      },
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Unable to create review' }, { status: 500 });
  }
}

// Handle GET requests (Optional, if you want to fetch reviews)
export async function GET() {
  try {
    const reviews = await prisma.review.findMany();
    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Unable to fetch reviews' }, { status: 500 });
  }
}
