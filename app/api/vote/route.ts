import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// Handle POST requests to cast a vote
export async function POST(req: NextRequest) {
  try {
    const { waitlistId, userId, vote } = await req.json();

    // Check if the user has already voted for this suggestion
    const existingVote = await db.vote.findUnique({
      where: {
        waitlistId_userId: {
          waitlistId,
          userId,
        },
      },
    });

    if (existingVote) {
      // If the vote exists, toggle the vote
      const updatedVote = await db.vote.update({
        where: {
          id: existingVote.id,
        },
        data: {
          vote,
        },
      });

      // Update the like or dislike count on the waitlist
      const updateField = vote
        ? { like: { increment: 1 }, dislike: { decrement: 1 } }
        : { like: { decrement: 1 }, dislike: { increment: 1 } };

      await db.waitlist.update({
        where: { id: waitlistId },
        data: updateField,
      });

      return NextResponse.json(updatedVote, { status: 200 });
    }

    // If no vote exists, create a new vote
    const newVote = await db.vote.create({
      data: {
        waitlistId,
        userId,
        vote,
      },
    });

    // Update the like or dislike count on the waitlist
    const updateField = vote ? { like: { increment: 1 } } : { dislike: { increment: 1 } };

    await db.waitlist.update({
      where: { id: waitlistId },
      data: updateField,
    });

    return NextResponse.json(newVote, { status: 201 });
  } catch (error) {
    console.error('Error creating vote:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
