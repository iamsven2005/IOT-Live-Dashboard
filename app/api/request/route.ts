import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Handle POST requests to create a new feature request
export async function POST(req: NextRequest) {
  try {
    const { email, suggest } = await req.json();

    const newRequest = await db.waitlist.create({
      data: {
        email,
        suggest,
      },
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Error creating feature request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Handle GET requests to fetch all feature requests
export async function GET() {
  try {
    const requests = await db.waitlist.findMany({
      include: {
        votes: true,
      },
    });

    return NextResponse.json(requests, { status: 200 });
  } catch (error) {
    console.error('Error fetching feature requests:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
