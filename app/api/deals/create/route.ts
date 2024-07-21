import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  const { name, price, description } = await req.json();

  if (!name || !price || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const newDeal = await db.deals.create({
      data: {
        name,
        price,
        description,
      },
    });

    return NextResponse.json(newDeal, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
