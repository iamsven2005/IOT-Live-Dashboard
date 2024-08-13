import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
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
    revalidatePath("/waitlist")
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

// Handle DELETE requests to delete a feature request
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Feature request ID is required.' }, { status: 400 });
    }

    // Delete related votes first
    await db.vote.deleteMany({
      where: { waitlistId: id },
    });

    // Then delete the feature request
    await db.waitlist.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Feature request deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting feature request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
