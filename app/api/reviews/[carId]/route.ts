import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { carId: string } }) {
    try {
      const reviews = await db.review.findMany({
        where:{
            carId: params.carId
        }
      });
      return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json({ error: 'Unable to fetch reviews' }, { status: 500 });
    }
  }